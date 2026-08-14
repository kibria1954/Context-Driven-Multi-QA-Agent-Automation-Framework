/**
 * Memory Helpers — Management and synchronization utilities for Dual-Store Memory Architecture.
 * Manages memory/healed-patterns.json and auto-syncs human-readable memory/healed-patterns.md.
 */
import * as fs from 'fs';
import * as path from 'path';

export interface HealedPattern {
  patternId: string;
  component: string;
  selectorPattern: string;
  interactionStrategy: string;
  successCount: number;
  failureCount: number;
  confidence: number;
  status: 'RAW' | 'CANDIDATE' | 'TRUSTED';
  lastValidated: string;
  applicablePages: string[];
}

export interface MemoryStore {
  version: string;
  lastUpdated: string;
  patterns: HealedPattern[];
}

const MEMORY_DIR = path.join(process.cwd(), 'memory');
const JSON_PATH = path.join(MEMORY_DIR, 'healed-patterns.json');
const MD_PATH = path.join(MEMORY_DIR, 'healed-patterns.md');
const HEAL_LOG_PATH = path.join(MEMORY_DIR, 'heal-log.md');
const PATTERN_LIBRARY_PATH = path.join(MEMORY_DIR, 'pattern-library.md');
const A11Y_FINDINGS_PATH = path.join(MEMORY_DIR, 'a11y-findings.md');

/**
 * Read current pattern memory store from JSON.
 */
export function readMemoryStore(): MemoryStore {
  try {
    if (fs.existsSync(JSON_PATH)) {
      return JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
    }
  } catch (error) {
    console.warn('⚠️ Warning: Failed to read memory store:', (error as Error).message);
  }
  return { version: '1.0.0', lastUpdated: new Date().toISOString(), patterns: [] };
}

/**
 * Get all TRUSTED patterns for pre-emptive guidance in Stage 2/5 codegen.
 */
export function getTrustedPatterns(): HealedPattern[] {
  const store = readMemoryStore();
  return store.patterns.filter((p) => p.status === 'TRUSTED');
}

/**
 * Save updated memory store and auto-sync to Markdown documentation.
 */
export function saveMemoryStore(store: MemoryStore): void {
  store.lastUpdated = new Date().toISOString();
  fs.mkdirSync(path.dirname(JSON_PATH), { recursive: true });
  fs.writeFileSync(JSON_PATH, JSON.stringify(store, null, 2), 'utf-8');
  syncMemoryToMarkdown(store);
}

/**
 * Auto-sync memory JSON to human-readable Markdown table.
 */
export function syncMemoryToMarkdown(store: MemoryStore): void {
  const trustedCount = store.patterns.filter((p) => p.status === 'TRUSTED').length;
  const candidateCount = store.patterns.filter((p) => p.status === 'CANDIDATE').length;

  let mdContent = `# 🧠 Knowledge Base — Trusted UI Interaction Patterns\n\n`;
  mdContent += `> **Auto-synchronized from \`memory/healed-patterns.json\` by Stage 9 Learning Loop.**\n\n`;
  mdContent += `---\n\n`;
  mdContent += `## 📊 Summary Metrics\n`;
  mdContent += `- **Total Patterns Registered**: ${store.patterns.length}\n`;
  mdContent += `- **Trusted Patterns**: ${trustedCount} (\`status: TRUSTED\`)\n`;
  mdContent += `- **Candidate Patterns**: ${candidateCount} (\`status: CANDIDATE\`)\n`;
  mdContent += `- **Last Sync**: \`${store.lastUpdated}\` \n\n`;
  mdContent += `---\n\n`;
  mdContent += `## 🛡️ Trusted Interaction Patterns\n\n`;
  mdContent += `| Pattern ID | Component | Selector Pattern | Status | Success Count | Confidence | Interaction Strategy |\n`;
  mdContent += `|---|---|---|---|---|---|---|\n`;

  for (const pattern of store.patterns) {
    const confPercent = Math.round(pattern.confidence * 100);
    mdContent += `| \`${pattern.patternId}\` | ${pattern.component} | \`${pattern.selectorPattern}\` | \`${pattern.status}\` | ${pattern.successCount} | ${confPercent}% | ${pattern.interactionStrategy} |\n`;
  }

  fs.writeFileSync(MD_PATH, mdContent, 'utf-8');
}

// ─── Heal Log (Append-Only Audit Trail) ──────────────────────────────────────

/**
 * Append a heal record to memory/heal-log.md.
 * This is the raw material the Pattern Library learns from.
 */
export function appendHealLog(entry: {
  runId: string;
  testId: string;
  feature: string;
  failureClass: string;
  error: string;
  rootCause: string;
  action: string;
  semanticVerification?: string;
  confidence: number;
  regressionPassed: boolean;
  autoCommitted: boolean;
}): void {
  const header = '# 🔧 Heal Log — Append-Only Audit Trail\n\n> Every self-heal action recorded with full evidence.\n> Source material for Pattern Library distillation.\n\n---\n\n';
  ensureMemoryFile(HEAL_LOG_PATH, header);

  let record = `\n## Heal Record — ${new Date().toISOString()}\n\n`;
  record += `- **Run ID:** \`${entry.runId}\`\n`;
  record += `- **Test:** ${entry.testId} (${entry.feature})\n`;
  record += `- **Failure Class:** \`${entry.failureClass}\`\n`;
  record += `- **Error:** ${entry.error}\n`;
  record += `- **Root Cause:** ${entry.rootCause}\n`;
  record += `- **Action:** ${entry.action}\n`;
  if (entry.semanticVerification) {
    record += `- **Semantic Verification:** ${entry.semanticVerification}\n`;
  }
  record += `- **Confidence:** ${Math.round(entry.confidence * 100)}%\n`;
  record += `- **Anti-Regression:** ${entry.regressionPassed ? '✅ Passed' : '❌ Failed'}\n`;
  record += `- **Auto-Committed:** ${entry.autoCommitted ? '✅ Yes' : '❌ No (flagged for review)'}\n`;
  record += `\n---\n`;

  fs.appendFileSync(HEAL_LOG_PATH, record, 'utf-8');
}

// ─── Pattern Library ─────────────────────────────────────────────────────────

/**
 * Read the distilled pattern library.
 */
export function readPatternLibrary(): string {
  if (!fs.existsSync(PATTERN_LIBRARY_PATH)) return '';
  return fs.readFileSync(PATTERN_LIBRARY_PATH, 'utf-8');
}

/**
 * Write/update the pattern library content.
 */
export function writePatternLibrary(content: string): void {
  fs.mkdirSync(path.dirname(PATTERN_LIBRARY_PATH), { recursive: true });
  fs.writeFileSync(PATTERN_LIBRARY_PATH, content, 'utf-8');
}

// ─── Accessibility Findings ──────────────────────────────────────────────────

/**
 * Append an accessibility finding to memory/a11y-findings.md.
 */
export function appendA11yFinding(entry: {
  feature: string;
  pageUrl: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  rule: string;
  element: string;
  description: string;
}): void {
  const header = '# ♿ Accessibility Findings\n\n> Non-blocking a11y scan results from Agent 3 (Live Explorer).\n> Building a backlog for accessibility improvements.\n\n---\n\n';
  ensureMemoryFile(A11Y_FINDINGS_PATH, header);

  const line = `| ${entry.impact} | ${entry.rule} | \`${entry.element}\` | ${entry.description} | ${entry.feature} | ${entry.pageUrl} | ${new Date().toISOString().split('T')[0]} |\n`;

  // Check if table header exists, if not add it
  const content = fs.readFileSync(A11Y_FINDINGS_PATH, 'utf-8');
  if (!content.includes('| Impact |')) {
    const tableHeader = '| Impact | Rule | Element | Description | Feature | Page | Date |\n|--------|------|---------|-------------|---------|------|------|\n';
    fs.appendFileSync(A11Y_FINDINGS_PATH, tableHeader, 'utf-8');
  }

  fs.appendFileSync(A11Y_FINDINGS_PATH, line, 'utf-8');
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

function ensureMemoryFile(filePath: string, header: string): void {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, header, 'utf-8');
  }
}
