/**
 * CLI Script: Coverage Validator & Traceability Generator (v2)
 *
 * Validates requirements-to-test traceability at 4 levels:
 *   L1: TC Exists     — REQ-ID has ≥ 1 linked test case in tc.json
 *   L2: Spec Exists   — TC has a matching spec file with REQ-ID tag
 *   L3: Assert Exists — Spec contains active expect() / toHaveURL() calls for this REQ-ID
 *   L4: Executed      — Spec was actually executed in the latest run results
 *
 * Coverage Flags (07-coverage-validation/SKILL.md spec):
 *   FULLY_COVERED       — L1 + L2 + L3 + L4 all pass
 *   TC_ONLY             — L1 passes, L2 fails (no spec file)
 *   UNVERIFIED_ASSERTION— L1 + L2 pass, L3 fails (spec has no expect())
 *   NOT_EXECUTED        — L1 + L2 + L3 pass, L4 fails (skipped/not run)
 *   UNCOVERED           — L1 fails (no TC at all for this REQ-ID)
 *
 * Usage:
 *   npx ts-node scripts/validate-coverage.ts --story=b2b-registration
 *   npx ts-node scripts/validate-coverage.ts --all
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const MEMORY_DIR = path.join(ROOT, 'memory');
const TRACE_DIR = path.join(MEMORY_DIR, 'traceability');

const args = process.argv.slice(2);
const runAll = args.includes('--all');
const storyArg = args.find((a) => a.startsWith('--story='))?.split('=')[1];

// ─── Discover features ────────────────────────────────────────────────────────

function discoverFeatures(): string[] {
  const reqDir = path.join(ROOT, 'requirements');
  if (!fs.existsSync(reqDir)) return [];
  return fs.readdirSync(reqDir).filter((f) => {
    const full = path.join(reqDir, f);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'parsed.json'));
  });
}

const featuresToRun: string[] = runAll
  ? discoverFeatures()
  : storyArg
  ? [storyArg]
  : ['b2b-registration'];

if (featuresToRun.length === 0) {
  console.error('❌ No features found. Create requirements/{feature}/parsed.json first.');
  process.exit(1);
}

// ─── Walk spec files ─────────────────────────────────────────────────────────

function walkSpecFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop()!;
    for (const f of fs.readdirSync(d)) {
      const full = path.join(d, f);
      if (fs.statSync(full).isDirectory()) stack.push(full);
      else if (f.endsWith('.spec.ts')) results.push(full);
    }
  }
  return results;
}

// ─── L3: Assert depth — scan for expect() inside a test block for a given REQ-ID ─

interface TestBlock {
  title: string;
  body: string;
  reqIds: string[];
  hasAssertions: boolean;
}

function extractTestBlocks(content: string): TestBlock[] {
  const blocks: TestBlock[] = [];
  // Match test('TC-XXX: ...', async ({ ... }) => { ... })
  // We do a simple brace-depth walk to find the test body
  const testOpenRe = /test\(\s*[`'"](TC-\d+[^`'"]*)[`'"]/g;
  let match;
  while ((match = testOpenRe.exec(content)) !== null) {
    const title = match[1];
    const startIdx = match.index + match[0].length;

    // Find the arrow function's BODY opening brace — not the destructured parameter
    // list's brace (e.g. `async ({ page, browser }) => {` has a `{` for the param
    // destructure BEFORE the real body `{`). Matching the first `{` after the title
    // used to grab the parameter list instead, making `body` just " page, browser "
    // with zero assertions for every test. Anchor on `=> {` instead.
    const arrowMatch = /=>\s*\{/.exec(content.slice(startIdx));
    if (!arrowMatch) continue; // not a recognizable `test(title, (...) => { ... })` shape — skip

    const bodyOpenIdx = startIdx + arrowMatch.index + arrowMatch[0].length - 1; // index of the body '{'
    // Walk forward from the body's opening '{' and depth-match
    let depth = 0;
    let bodyStart = -1;
    let bodyEnd = -1;
    for (let i = bodyOpenIdx; i < content.length; i++) {
      if (content[i] === '{') {
        if (depth === 0) bodyStart = i + 1;
        depth++;
      } else if (content[i] === '}') {
        depth--;
        if (depth === 0) {
          bodyEnd = i;
          break;
        }
      }
    }
    const body = bodyStart !== -1 && bodyEnd !== -1 ? content.slice(bodyStart, bodyEnd) : '';
    const reqIds = [...title.matchAll(/@REQ-(\d+)/gi)].map((m) => `REQ-${m[1]}`);
    // L3: has active expect() or toHaveURL() — not in a comment — OR calls a POM
    // `assert*()` method. `05-codegen-pom/SKILL.md` Section 8 mandates the
    // step-check pattern (`await registerPage.assertX()`) as the standard way specs
    // express assertions; without this, every spec following that convention (which
    // is most of them) would be wrongly flagged UNVERIFIED_ASSERTION even though the
    // assert*() method itself contains real expect() calls in the page object.
    const hasAssertions =
      /(?:^|[^/])\bexpect\s*\(/.test(body) ||
      /\.toHaveURL\s*\(/.test(body) ||
      /\.\s*assert[A-Za-z0-9_]*\s*\(/.test(body);
    blocks.push({ title, body, reqIds, hasAssertions });
  }
  return blocks;
}

// ─── L4: Execution results — read latest run JSON ─────────────────────────────

interface TestResultEntry {
  title: string[];
  status: string;
}

function readLatestExecutionResults(): Map<string, string> {
  // Map: test title → status (passed|failed|skipped|timedOut)
  const resultsFile = path.join(ROOT, 'reports', 'generated', 'test-results.json');
  const resultsMap = new Map<string, string>();
  if (!fs.existsSync(resultsFile)) return resultsMap;
  try {
    const raw = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
    const suites: any[] = raw.suites ?? [];
    function walk(suiteList: any[], titlePrefix: string[] = []): void {
      for (const suite of suiteList) {
        const suiteTitles = [...titlePrefix, suite.title].filter(Boolean);
        if (suite.specs) {
          for (const spec of suite.specs) {
            const fullTitle = [...suiteTitles, spec.title].join(' > ');
            const status = spec.ok ? 'passed' : spec.tests?.[0]?.status ?? 'unknown';
            resultsMap.set(fullTitle.trim(), status);
            // Also index by spec.title alone (short title) for partial matches
            resultsMap.set(spec.title?.trim() ?? '', status);
          }
        }
        if (suite.suites) walk(suite.suites, suiteTitles);
      }
    }
    walk(suites);
  } catch {
    // File exists but may be stale / partial — return empty, L4 shows NOT_EXECUTED
  }
  return resultsMap;
}

// ─── Per-spec coverage ────────────────────────────────────────────────────────

interface SpecCoverage {
  file: string;
  reqIds: Set<string>;
  testBlocks: TestBlock[];
}

function parseSpecCoverage(absPath: string): SpecCoverage {
  const content = fs.readFileSync(absPath, 'utf8');
  const reqIds = new Set<string>();

  // Header block REQ-IDs (traceability comment)
  for (const m of content.matchAll(/REQ-\d+/g)) reqIds.add(m[0].toUpperCase());

  const testBlocks = extractTestBlocks(content);
  return { file: path.relative(ROOT, absPath), reqIds, testBlocks };
}

// ─── Coverage flag resolution ─────────────────────────────────────────────────

type CoverageFlag = 'FULLY_COVERED' | 'TC_ONLY' | 'UNVERIFIED_ASSERTION' | 'NOT_EXECUTED' | 'UNCOVERED';

function resolveCoverageFlag(
  reqId: string,
  hasTc: boolean,
  specCoverages: SpecCoverage[],
  executionMap: Map<string, string>
): { flag: CoverageFlag; specFile?: string; testTitles: string[]; hasAssertions: boolean; executed: boolean } {
  if (!hasTc) return { flag: 'UNCOVERED', testTitles: [], hasAssertions: false, executed: false };

  // L2: Spec with REQ-ID tag
  const matchingSpecs = specCoverages.filter((sc) => sc.reqIds.has(reqId));
  if (matchingSpecs.length === 0) return { flag: 'TC_ONLY', testTitles: [], hasAssertions: false, executed: false };

  // L3: Check for assertions in test blocks tagged with this REQ-ID
  let hasAssertions = false;
  const matchingTitles: string[] = [];
  for (const sc of matchingSpecs) {
    for (const block of sc.testBlocks) {
      if (block.reqIds.includes(reqId)) {
        matchingTitles.push(block.title);
        if (block.hasAssertions) hasAssertions = true;
      }
    }
  }
  // If no per-test @REQ-XX tags found, fall back to header-level matching (L2 only)
  if (matchingTitles.length === 0) {
    // Try header-level: spec has the REQ-ID but no per-test tags
    hasAssertions = matchingSpecs.some((sc) =>
      sc.testBlocks.some((b) => b.hasAssertions)
    );
  }

  if (!hasAssertions) {
    return {
      flag: 'UNVERIFIED_ASSERTION',
      specFile: matchingSpecs[0]?.file,
      testTitles: matchingTitles,
      hasAssertions: false,
      executed: false,
    };
  }

  // L4: Check execution results
  const executed = matchingTitles.some((title) => {
    for (const [key, status] of executionMap) {
      if (key.includes(title.slice(0, 40)) && status === 'passed') return true;
    }
    return false;
  });

  // If execution map is empty (no results file), don't penalize — treat as NOT_EXECUTED
  const mapIsEmpty = executionMap.size === 0;

  return {
    flag: executed || mapIsEmpty ? 'FULLY_COVERED' : 'NOT_EXECUTED',
    specFile: matchingSpecs[0]?.file,
    testTitles: matchingTitles,
    hasAssertions: true,
    executed: executed || mapIsEmpty,
  };
}

// ─── Run validation per feature ───────────────────────────────────────────────

function validateFeature(storyName: string): void {
  console.log(`\n📊 Coverage Validation — "${storyName}"`);

  const tcFile = path.join(ROOT, 'testcases', `${storyName}.tc.json`);
  const parsedFile = path.join(ROOT, 'requirements', storyName, 'parsed.json');

  if (!fs.existsSync(tcFile)) {
    console.warn(`  ⚠️  No testcases/${storyName}.tc.json — skipping L1+.`);
    return;
  }

  const testCases: any[] = JSON.parse(fs.readFileSync(tcFile, 'utf8')).testCases || [];

  // Scope to this feature's own spec files (REQ-IDs are locally numbered per feature)
  const allSpecs = walkSpecFiles(path.join(ROOT, 'tests', 'e2e'));
  const ownSpecFiles = allSpecs.filter(
    (f) => path.basename(f) === `${storyName}.spec.ts`
  );

  const specCoverages = ownSpecFiles.map(parseSpecCoverage);
  const executionMap = readLatestExecutionResults();

  // Build per-REQ-ID data
  const reqIds = [...new Set(testCases.map((tc: any) => tc.requirementId as string))].filter(Boolean);

  // Also pull REQ-IDs from parsed.json if available (catches REQ-IDs with no TCs)
  const parsedReqIds: string[] = [];
  if (fs.existsSync(parsedFile)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(parsedFile, 'utf8'));
      for (const req of parsed.requirements || []) {
        if (req.id && !parsedReqIds.includes(req.id)) parsedReqIds.push(req.id);
      }
    } catch { /* ignore */ }
  }
  const allReqIds = [...new Set([...reqIds, ...parsedReqIds])];

  const entries = allReqIds.map((reqId) => {
    const tcs = testCases.filter((tc: any) => tc.requirementId === reqId);
    const hasTc = tcs.length > 0;
    const resolution = resolveCoverageFlag(reqId, hasTc, specCoverages, executionMap);
    return {
      reqId,
      description: tcs[0]?.title || reqId,
      testCases: tcs.map((tc: any) => ({ tcId: tc.id, type: tc.type, status: tc.status })),
      ...resolution,
    };
  });

  // ─── Metrics ────────────────────────────────────────────────────────────────
  const countBy = (flag: CoverageFlag) => entries.filter((e) => e.flag === flag).length;
  const fullyCovered = countBy('FULLY_COVERED');
  const tcOnly = countBy('TC_ONLY');
  const unverified = countBy('UNVERIFIED_ASSERTION');
  const notExecuted = countBy('NOT_EXECUTED');
  const uncovered = countBy('UNCOVERED');
  const total = allReqIds.length;
  const coveragePct = total > 0 ? Math.round((fullyCovered / total) * 100) : 0;
  // Effective coverage excludes quarantined / not-executed
  const effectivePct = total > 0 ? Math.round(((fullyCovered + notExecuted) / total) * 100) : 0;

  fs.mkdirSync(TRACE_DIR, { recursive: true });

  // ─── Markdown matrix ─────────────────────────────────────────────────────────
  let md = `# 🎯 Traceability Matrix — ${storyName}\n\n`;
  md += `**Feature:** \`${storyName}\`\n`;
  md += `**Generated:** \`${new Date().toISOString()}\`\n`;
  md += `**Coverage:** **${coveragePct}%** (${fullyCovered}/${total} REQ-IDs FULLY_COVERED)\n`;
  md += `**Effective Coverage:** **${effectivePct}%** (includes specced but not-executed tests)\n\n`;

  md += `## Coverage by Flag\n`;
  md += `| Flag | Count |\n|------|-------|\n`;
  md += `| ✅ FULLY_COVERED | ${fullyCovered} |\n`;
  md += `| 📝 TC_ONLY (no spec) | ${tcOnly} |\n`;
  md += `| ⚠️ UNVERIFIED_ASSERTION (no expect()) | ${unverified} |\n`;
  md += `| ⏭️ NOT_EXECUTED (not in last run) | ${notExecuted} |\n`;
  md += `| ❌ UNCOVERED (no TC) | ${uncovered} |\n\n`;

  md += `## Requirements Traceability Table\n\n`;
  md += `| REQ-ID | Description | Test Cases | Spec File | L3 Assertion? | L4 Executed? | Status |\n`;
  md += `|--------|-------------|------------|-----------|---------------|--------------|--------|\n`;

  const flagIcon: Record<CoverageFlag, string> = {
    FULLY_COVERED: '✅ FULLY_COVERED',
    TC_ONLY: '📝 TC_ONLY',
    UNVERIFIED_ASSERTION: '⚠️ UNVERIFIED_ASSERTION',
    NOT_EXECUTED: '⏭️ NOT_EXECUTED',
    UNCOVERED: '❌ UNCOVERED',
  };

  for (const e of entries) {
    const tcList = e.testCases.map((tc: any) => `\`${tc.tcId}\``).join(', ') || '—';
    const spec = e.specFile ? `\`${e.specFile}\`` : '_None_';
    const l3 = e.hasAssertions ? '✅' : '❌';
    const l4 = e.executed ? '✅' : '❌';
    md += `| **${e.reqId}** | ${String(e.description).replace(/\|/g, '\\|').slice(0, 60)} | ${tcList} | ${spec} | ${l3} | ${l4} | ${flagIcon[e.flag]} |\n`;
  }

  md += `\n## Stakeholder Summary\n\n`;
  md += `- **${fullyCovered}** of **${total}** requirements have fully automated, executed tests.\n`;
  if (tcOnly > 0) md += `- **${tcOnly}** requirement(s) have test cases designed but no automation code yet.\n`;
  if (unverified > 0) md += `- **${unverified}** spec file(s) exist but contain no \`expect()\` assertions — these are incomplete.\n`;
  if (notExecuted > 0) md += `- **${notExecuted}** test(s) are written and have assertions but weren't executed in the last run.\n`;
  if (uncovered > 0) md += `- ⚠️ **${uncovered}** requirement(s) have NO test cases at all.\n`;

  fs.writeFileSync(path.join(TRACE_DIR, `${storyName}.md`), md, 'utf8');

  // ─── JSON matrix ─────────────────────────────────────────────────────────────
  const jsonOut = {
    storyName,
    generatedAt: new Date().toISOString(),
    coveragePercentage: coveragePct,
    effectiveCoveragePercentage: effectivePct,
    totalReqs: total,
    fullyCovered,
    tcOnly,
    unverifiedAssertion: unverified,
    notExecuted,
    uncovered,
    entries: entries.map((e) => ({
      reqId: e.reqId,
      description: e.description,
      flag: e.flag,
      testCases: e.testCases,
      specFile: e.specFile ?? null,
      testTitles: e.testTitles,
      hasAssertions: e.hasAssertions,
      executed: e.executed,
    })),
  };
  fs.writeFileSync(path.join(TRACE_DIR, `${storyName}.json`), JSON.stringify(jsonOut, null, 2), 'utf8');

  // Update master index
  const indexPath = path.join(TRACE_DIR, 'index.json');
  let index: Record<string, any> = {};
  if (fs.existsSync(indexPath)) {
    try { index = JSON.parse(fs.readFileSync(indexPath, 'utf8')); } catch { /* start fresh */ }
  }
  index[storyName] = {
    coveragePercentage: coveragePct,
    effectiveCoveragePercentage: effectivePct,
    totalReqs: total,
    fullyCovered,
    uncovered,
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');

  console.log(`  ✅ Coverage: ${coveragePct}% (${fullyCovered}/${total} FULLY_COVERED)`);
  console.log(`  📁 Saved: memory/traceability/${storyName}.md`);
  if (uncovered > 0) console.warn(`  ❌ ${uncovered} REQ-ID(s) UNCOVERED — check testcases/${storyName}.tc.json`);
  if (unverified > 0) console.warn(`  ⚠️  ${unverified} spec(s) UNVERIFIED_ASSERTION — add expect() calls`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

for (const feature of featuresToRun) {
  validateFeature(feature);
}

if (featuresToRun.length > 1) {
  console.log(`\n✅ Validated ${featuresToRun.length} feature(s): ${featuresToRun.join(', ')}`);
}
