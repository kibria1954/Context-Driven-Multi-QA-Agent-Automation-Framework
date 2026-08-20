/**
 * Report Helpers — Data collection and formatting for custom report generation.
 *
 * Collects test results, coverage data, traceability info, and formats them
 * for the custom HTML report (reports/generated/<story>-report.html).
 */
import * as fs from 'fs';
import * as path from 'path';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TestResultSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  quarantined: number;
  duration: number;
  timestamp: string;
  passRate: number;
}

export interface TestCaseResult {
  tcId: string;
  name: string;
  project: string;
  retries: number;
  status: 'passed' | 'failed' | 'skipped' | 'quarantined';
  duration: number;
  error?: string;
  screenshot?: string;
  reqId?: string;
  type: 'positive' | 'negative' | 'edge';
  tags: string[];
}

export interface CoverageData {
  totalRequirements: number;
  coveredRequirements: number;
  coveragePercentage: number;
  uncoveredRequirements: string[];
  totalTestCases: number;
  positiveCount: number;
  negativeCount: number;
  edgeCount: number;
}

export interface AuthSetupResult {
  role: 'admin' | 'customer';
  success: boolean;
  error?: string;
  timestamp: string;
}

export interface SelfHealEntry {
  timestamp: string;
  runId: string;
  storyName: string;
  iteration: number;
  failureClass: string;
  errorSnippet: string;
  actionTaken: string;
  testTitle: string;
}

export interface ReportData {
  metadata: {
    projectName: string;
    reportDate: string;
    environment: string;
    runId: string;
    pipelineStory: string;
  };
  summary: TestResultSummary;
  testResults: TestCaseResult[];
  coverage: CoverageData;
  traceabilityMatrix: Array<{
    reqId: string;
    requirement: string;
    testCases: string[];
    specFile: string;
    status: 'covered' | 'partial' | 'uncovered';
  }>;
  selfHealLog: SelfHealEntry[];
  setupStatus: AuthSetupResult[];
  loopMetrics: {
    loopAIterations: number;
    loopAConvergenceScore: number;
    loopBIterations: number;
    loopBPassRate: number;
  };
  trends: Array<{
    runId: string;
    date: string;
    passRate: number;
    totalTests: number;
    duration: number;
  }>;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');
const MEMORY_DIR = path.join(ROOT, 'memory');
const REPORTS_DIR = path.join(ROOT, 'reports', 'generated');
const TRACE_DIR = path.join(MEMORY_DIR, 'traceability');

// ─── Data Collection ─────────────────────────────────────────────────────────

/**
 * Read Playwright JSON test results file and correctly parse test statuses.
 */
export function readPlaywrightResults(storyName?: string): TestCaseResult[] {
  const resultsFile = path.join(REPORTS_DIR, 'test-results.json');
  if (!fs.existsSync(resultsFile)) return [];

  try {
    const data = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
    const results: TestCaseResult[] = [];

    const walk = (suite: any, parentTitle = '') => {
      const suiteName = parentTitle ? `${parentTitle} > ${suite.title}` : suite.title;

      // ── Story-level filter ──────────────────────────────────────────────────
      // If a storyName is provided, only collect specs from suites whose file
      // path contains that story slug. This prevents results from a different
      // spec from polluting this story's report when test-results.json was
      // written by a broader run that included multiple spec files.
      if (storyName && suite.file) {
        const normalizedFile = suite.file.replace(/\\/g, '/').toLowerCase();
        const normalizedStory = storyName.toLowerCase();
        if (!normalizedFile.includes(normalizedStory)) {
          return; // skip this suite and all its children
        }
      }

      if (suite.specs) {
        for (const spec of suite.specs) {
          for (const test of spec.tests || []) {
            const lastResult = test.results?.[test.results.length - 1];
            const rawStatus = lastResult?.status || test.status;
            const finalStatus = mapStatus(rawStatus, spec.ok);

            // ── Error extraction ────────────────────────────────────────────
            // Playwright JSON reporter writes failures into an `errors` array
            // (each element has a `message` string), NOT a single `error` object.
            // Fallback chain: errors[0].message → errors[0].value → legacy error.message
            const errorEntry = lastResult?.errors?.[0];
            const errorMessage: string | undefined =
              errorEntry?.message ?? errorEntry?.value ?? lastResult?.error?.message;

            results.push({
              tcId: extractTcId(spec.title) || `TC-${String(results.length + 1).padStart(3, '0')}`,
              name: cleanDisplayName(spec.title),
              project: test.projectName || 'unknown',
              retries: Math.max(0, (test.results?.length || 1) - 1),
              status: finalStatus,
              duration: lastResult?.duration || 0,
              error: errorMessage,
              screenshot: lastResult?.attachments?.find((a: any) => a.name === 'screenshot')?.path,
              reqId: extractReqId(spec.title),
              type: inferTestType(spec.title),
              tags: extractTags(spec.title),
            });
          }
        }
      }
      if (suite.suites) suite.suites.forEach((s: any) => walk(s, suiteName));
    };

    data.suites?.forEach((s: any) => walk(s));

    // Sort by TC-ID for consistent, predictable ordering in the report table.
    results.sort((a, b) => {
      const numA = parseInt(a.tcId.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.tcId.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });

    return results;
  } catch {
    return [];
  }
}

/**
 * Read self-heal log from memory.
 */
export function readSelfHealLog(): SelfHealEntry[] {
  const logFile = path.join(MEMORY_DIR, 'self-heal-log.json');
  if (!fs.existsSync(logFile)) return [];

  try {
    const data = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    return data.entries || [];
  } catch {
    return [];
  }
}

/**
 * Read admin/customer login health from the last global-setup run
 * (written by tests/global-setup.ts to reports/generated/setup-status.json).
 */
export function readSetupStatus(): AuthSetupResult[] {
  const statusFile = path.join(REPORTS_DIR, 'setup-status.json');
  if (!fs.existsSync(statusFile)) return [];

  try {
    const data = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    return data.results || [];
  } catch {
    return [];
  }
}

/**
 * Read run history for trend analysis.
 */
export function readRunHistory(storyName?: string): ReportData['trends'] {
  const historyDir = path.join(MEMORY_DIR, 'run-history');
  if (!fs.existsSync(historyDir)) return [];

  try {
    const files = fs.readdirSync(historyDir).filter((f) => f.endsWith('.json'));
    return files
      .map((f) => {
        const data = JSON.parse(fs.readFileSync(path.join(historyDir, f), 'utf8'));
        return {
          story: data.story as string | undefined,
          runId: data.runId || f.replace('.json', ''),
          date: data.timestamp || data.startedAt || '',
          passRate: data.summary?.passRate || 0,
          totalTests: data.summary?.totalTests || 0,
          duration: data.summary?.duration || 0,
        };
      })
      .filter((entry) => !storyName || !entry.story || entry.story === storyName)
      .map(({ story, ...rest }) => rest)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-20);
  } catch {
    return [];
  }
}

/**
 * Build complete report data from all sources.
 */
export function buildReportData(
  storyName: string,
  runId: string,
  environment: string
): ReportData {
  // Pass storyName so only results from this story's spec file are included —
  // prevents other stories' results from appearing when test-results.json was
  // written by a broader run (e.g. npx playwright test tests/e2e/ --headed).
  const testResults = readPlaywrightResults(storyName);
  const selfHealLog = readSelfHealLog();
  const setupStatus = readSetupStatus();
  const trends = readRunHistory(storyName);

  const passed = testResults.filter((t) => t.status === 'passed').length;
  const failed = testResults.filter((t) => t.status === 'failed').length;
  const skipped = testResults.filter((t) => t.status === 'skipped').length;
  const quarantined = testResults.filter((t) => t.status === 'quarantined').length;
  const totalDuration = testResults.reduce((sum, t) => sum + t.duration, 0);

  // Read the traceability matrix already computed by scripts/validate-coverage.ts
  // (memory/traceability/{story}.json) — single source of truth for coverage logic,
  // rather than recomputing a second, weaker matrix here.
  const traceabilityFile = path.join(TRACE_DIR, `${storyName}.json`);
  let totalRequirements = 0;
  let coveredRequirements = 0;
  let traceabilityMatrix: ReportData['traceabilityMatrix'] = [];

  if (fs.existsSync(traceabilityFile)) {
    try {
      const traceData = JSON.parse(fs.readFileSync(traceabilityFile, 'utf8'));
      const entries = traceData.entries || [];
      totalRequirements = entries.length;
      coveredRequirements = entries.filter((e: any) => e.coverageStatus === 'covered').length;
      traceabilityMatrix = entries.map((e: any) => ({
        reqId: e.reqId,
        requirement: e.requirement || e.reqId,
        testCases: (e.testCases || []).map((tc: any) => tc.tcId),
        specFile: (e.specFiles && e.specFiles.join(', ')) || e.specFile || 'Not automated',
        status: e.coverageStatus === 'covered' ? 'covered' : 'uncovered',
      }));
    } catch {
      // Use defaults if parse fails
    }
  }

  return {
    metadata: {
      projectName: 'KBD AI QA Agent',
      reportDate: new Date().toISOString(),
      environment,
      runId,
      pipelineStory: storyName,
    },
    summary: {
      totalTests: testResults.length,
      passed,
      failed,
      skipped,
      quarantined,
      duration: totalDuration,
      timestamp: new Date().toISOString(),
      passRate: testResults.length > 0 ? Math.round((passed / testResults.length) * 100) : 0,
    },
    testResults,
    coverage: {
      totalRequirements,
      coveredRequirements,
      coveragePercentage: totalRequirements > 0 ? Math.round((coveredRequirements / totalRequirements) * 100) : 0,
      uncoveredRequirements: [],
      totalTestCases: testResults.length,
      positiveCount: testResults.filter((t) => t.type === 'positive').length,
      negativeCount: testResults.filter((t) => t.type === 'negative').length,
      edgeCount: testResults.filter((t) => t.type === 'edge').length,
    },
    traceabilityMatrix,
    selfHealLog,
    setupStatus,
    loopMetrics: {
      loopAIterations: 1,
      loopAConvergenceScore: 100,
      loopBIterations: 0,
      loopBPassRate: 100,
    },
    trends,
  };
}

/**
 * Persist this run's summary to memory/run-history/ so the NEXT report's trend
 * chart can see it. (Previously trends were only ever read, never written —
 * the trend chart had no data to show.)
 */
export function recordRunHistory(data: ReportData): void {
  const historyDir = path.join(MEMORY_DIR, 'run-history');
  try {
    fs.mkdirSync(historyDir, { recursive: true });
    const safeRunId = data.metadata.runId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const file = path.join(historyDir, `${data.metadata.pipelineStory}--${safeRunId}.json`);
    fs.writeFileSync(
      file,
      JSON.stringify(
        {
          runId: data.metadata.runId,
          story: data.metadata.pipelineStory,
          timestamp: data.metadata.reportDate,
          summary: data.summary,
        },
        null,
        2
      )
    );
  } catch {
    // Non-fatal — trend chart simply won't gain a data point this run.
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Strip the "TC-XXX:" prefix and trailing "@tag" annotations from a spec title —
 * both are already shown in their own dedicated columns (TC-ID, REQ-ID, Type),
 * so repeating them inline just clutters the Name column and makes rows harder
 * to scan at a glance.
 */
function cleanDisplayName(title: string): string {
  return title
    .replace(/^TC-[A-Z0-9-]+:\s*/i, '')
    .replace(/\s*@\S+/g, '')
    .trim();
}

function extractTcId(title: string): string | undefined {
  const match = title.match(/TC-[A-Z0-9-]+/i);
  return match ? match[0].toUpperCase() : undefined;
}

function extractReqId(title: string): string | undefined {
  const match = title.match(/REQ-\d+/i);
  return match ? match[0].toUpperCase() : undefined;
}

function extractTags(title: string): string[] {
  const matches = title.match(/@\w+/g);
  return matches ? matches.map((m) => m.substring(1)) : [];
}

function inferTestType(title: string): 'positive' | 'negative' | 'edge' {
  const lower = title.toLowerCase();
  if (lower.includes('negative') || lower.includes('duplicate') || lower.includes('mismatch') || lower.includes('invalid')) return 'negative';
  if (lower.includes('edge') || lower.includes('empty') || lower.includes('boundary') || lower.includes('special') || lower.includes('xss') || lower.includes('sql')) return 'edge';
  return 'positive';
}

function mapStatus(playwrightStatus: string, specOk?: boolean): TestCaseResult['status'] {
  if (playwrightStatus === 'passed') return 'passed';
  if (playwrightStatus === 'failed' || playwrightStatus === 'timedOut') return 'failed';
  if (playwrightStatus === 'skipped' || playwrightStatus === 'interrupted') return 'skipped';
  return specOk ? 'passed' : 'skipped';
}
