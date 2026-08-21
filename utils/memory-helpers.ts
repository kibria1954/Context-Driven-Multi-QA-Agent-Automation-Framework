/**
 * Memory Helpers — Management and synchronization utilities for Dual-Store Memory Architecture.
 * Manages memory/healed-patterns.json and auto-syncs human-readable memory/healed-patterns.md.
 */
import * as fs from 'fs';
import * as path from 'path';

export interface HealedPattern {
  patternId: string;
  component: string;
  /**
   * 'interaction' = a positive "do it this way" pattern promoted via repeated successes.
   * 'anti-pattern' = a "never do X" lesson, usually from a single severe SETUP_INFRA_ISSUE /
   * cascading-failure incident. Anti-patterns don't wait for successCount >= 3 to reach
   * TRUSTED — see "Anti-Pattern Fast-Track" in `09-learning-prevention/SKILL.md`.
   */
  patternType: 'interaction' | 'anti-pattern';
  selectorPattern: string;
  /** For 'interaction': the working strategy. For 'anti-pattern': the rule / safe alternative. */
  interactionStrategy: string;
  successCount: number;
  failureCount: number;
  confidence: number;
  status: 'RAW' | 'CANDIDATE' | 'TRUSTED' | 'DEPRECATED';
  /** True if this pattern must always be flagged for human review even at high confidence
   * (e.g. any SETUP_INFRA_ISSUE-class fix — see Review Gate table in `06-execution-self-heal/SKILL.md`). */
  alwaysRequiresReview?: boolean;
  lastValidated: string;
  applicablePages: string[];
  /**
   * Feature slugs this pattern applies to. Use ['*'] for platform-wide NopCommerce patterns
   * (modals, popups, auth, navigation) that apply to every feature's codegen.
   * GAP-007: all patterns should declare this — scoped patterns list specific features.
   */
  applicableFeatures?: string[];
  /**
   * Feature slugs where this pattern has actually been observed and validated in practice.
   * Used by distill-patterns.ts for cross-feature promotion gate (IMP-004):
   * CANDIDATE → TRUSTED requires observedInFeatures.length >= 2 for platform-wide patterns.
   */
  observedInFeatures?: string[];
  /** Heal-log timestamps (or self-heal-log entries) this pattern was distilled from. */
  sourceHealIds?: string[];
  notes?: string;
  confidenceCaveat?: string;
}

export interface MemoryStore {
  version: string;
  lastUpdated: string;
  patterns: HealedPattern[];
}

/** Mirrors `SelfHealEntry` in `utils/report-helpers.ts` — kept as a local decoupled copy
 * so this module doesn't need to import from the reporting layer. */
export interface SelfHealLogEntry {
  timestamp: string;
  runId: string;
  storyName: string;
  iteration: number;
  failureClass: string;
  errorSnippet: string;
  actionTaken: string;
  testTitle: string;
}

export interface SelfHealLogStore {
  lastUpdated: string;
  totalSelfHeals: number;
  entries: SelfHealLogEntry[];
}

const MEMORY_DIR = path.join(process.cwd(), 'memory');
const JSON_PATH = path.join(MEMORY_DIR, 'healed-patterns.json');
const MD_PATH = path.join(MEMORY_DIR, 'healed-patterns.md');
const HEAL_LOG_PATH = path.join(MEMORY_DIR, 'heal-log.md');
const SELF_HEAL_LOG_PATH = path.join(MEMORY_DIR, 'self-heal-log.json');
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
  const interactionPatterns = store.patterns.filter((p) => p.patternType !== 'anti-pattern');
  const antiPatterns = store.patterns.filter((p) => p.patternType === 'anti-pattern');
  const trustedCount = store.patterns.filter((p) => p.status === 'TRUSTED').length;
  const candidateCount = store.patterns.filter((p) => p.status === 'CANDIDATE').length;

  let mdContent = `# 🧠 Knowledge Base — Trusted UI Interaction Patterns & Anti-Patterns\n\n`;
  mdContent += `> **Auto-synchronized from \`memory/healed-patterns.json\` by Stage 9 Learning Loop.**\n\n`;
  mdContent += `---\n\n`;
  mdContent += `## 📊 Summary Metrics\n`;
  mdContent += `- **Total Patterns Registered**: ${store.patterns.length} (${interactionPatterns.length} interaction, ${antiPatterns.length} anti-pattern)\n`;
  mdContent += `- **Trusted Patterns**: ${trustedCount} (\`status: TRUSTED\`)\n`;
  mdContent += `- **Candidate Patterns**: ${candidateCount} (\`status: CANDIDATE\`)\n`;
  mdContent += `- **Last Sync**: \`${store.lastUpdated}\` \n\n`;
  mdContent += `---\n\n`;
  mdContent += `## 🛡️ Trusted Interaction Patterns\n\n`;
  mdContent += `| Pattern ID | Component | Selector Pattern | Status | Success Count | Confidence | Interaction Strategy |\n`;
  mdContent += `|---|---|---|---|---|---|---|\n`;

  for (const pattern of interactionPatterns) {
    const confPercent = Math.round(pattern.confidence * 100);
    mdContent += `| \`${pattern.patternId}\` | ${pattern.component} | \`${pattern.selectorPattern}\` | \`${pattern.status}\` | ${pattern.successCount} | ${confPercent}% | ${pattern.interactionStrategy} |\n`;
  }

  mdContent += `\n---\n\n`;
  mdContent += `## ❌ Anti-Patterns (Avoid)\n\n`;
  mdContent += `> Distilled from \`SETUP_INFRA_ISSUE\` / cascading-failure incidents. Always flagged for human review regardless of confidence — see Review Gate in \`06-execution-self-heal/SKILL.md\`.\n\n`;
  mdContent += `| Pattern ID | Component | Status | Confidence | Rule / Safe Alternative | Source Heals |\n`;
  mdContent += `|---|---|---|---|---|---|\n`;

  for (const pattern of antiPatterns) {
    const confPercent = Math.round(pattern.confidence * 100);
    const sources = (pattern.sourceHealIds || []).join(', ') || '—';
    mdContent += `| \`${pattern.patternId}\` | ${pattern.component} | \`${pattern.status}\` | ${confPercent}% | ${pattern.interactionStrategy} | ${sources} |\n`;
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

// ─── Self-Heal Log (Machine-Readable Execution Audit Trail) ─────────────────

/**
 * Read the machine-readable self-heal execution audit log.
 * This is the JSON twin of `heal-log.md` — `utils/report-helpers.ts::readSelfHealLog()`
 * reads this same file to populate the HTML report's heal section, so every heal
 * recorded via `appendHealLog()` should also go through `appendSelfHealLogEntry()`.
 */
export function readSelfHealLogStore(): SelfHealLogStore {
  try {
    if (fs.existsSync(SELF_HEAL_LOG_PATH)) {
      return JSON.parse(fs.readFileSync(SELF_HEAL_LOG_PATH, 'utf-8'));
    }
  } catch (error) {
    console.warn('⚠️ Warning: Failed to read self-heal log:', (error as Error).message);
  }
  return { lastUpdated: new Date().toISOString(), totalSelfHeals: 0, entries: [] };
}

/**
 * Append one entry to `memory/self-heal-log.json`. Call this alongside `appendHealLog()`
 * for every heal action — they must stay in sync (see ANTI-010 / dual-store drift finding).
 */
export function appendSelfHealLogEntry(entry: SelfHealLogEntry): void {
  const store = readSelfHealLogStore();
  store.entries.push(entry);
  store.totalSelfHeals = store.entries.length;
  store.lastUpdated = new Date().toISOString();
  fs.mkdirSync(path.dirname(SELF_HEAL_LOG_PATH), { recursive: true });
  fs.writeFileSync(SELF_HEAL_LOG_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

// ─── Circuit Breaker Enforcement (Loop B Hard Limits) ────────────────────────

export interface CircuitBreakerCheck {
  breached: boolean;
  reason?: string;
  attemptsForTest: number;
  totalHealsInRun: number;
}

/**
 * Programmatic check for the Loop B hard limits in `AGENTS.md` / `06-execution-self-heal/SKILL.md`:
 * max 5 heal attempts per failing test, max 10 total heals per run. Previously these limits
 * existed only as prose the agent had to self-count against — this gives a real, file-backed
 * count to check BEFORE attempting another heal.
 */
export function checkCircuitBreaker(runId: string, testTitle: string): CircuitBreakerCheck {
  const store = readSelfHealLogStore();
  const entriesInRun = store.entries.filter((e) => e.runId === runId);
  const attemptsForTest = entriesInRun.filter((e) => e.testTitle === testTitle).length;
  const totalHealsInRun = entriesInRun.length;

  if (attemptsForTest >= 5) {
    return {
      breached: true,
      reason: `Test "${testTitle}" has already had ${attemptsForTest} heal attempts in run "${runId}" (max 5) — STOP, rollback, escalate.`,
      attemptsForTest,
      totalHealsInRun,
    };
  }
  if (totalHealsInRun >= 10) {
    return {
      breached: true,
      reason: `Run "${runId}" has already recorded ${totalHealsInRun} total heals (max 10 per run) — flag as systemic issue, stop healing.`,
      attemptsForTest,
      totalHealsInRun,
    };
  }
  return { breached: false, attemptsForTest, totalHealsInRun };
}

// ─── Memory Freshness Drift Detection ────────────────────────────────────────

export interface FreshnessReport {
  stale: boolean;
  healLogLastEntry: string | null;
  selfHealLogLastUpdated: string;
  patternStoreLastUpdated: string;
  warnings: string[];
}

/**
 * Compares `heal-log.md`'s most recent record timestamp against the `lastUpdated` fields
 * of `self-heal-log.json` and `healed-patterns.json`. These are supposed to move together;
 * silent drift between the hand-maintained Markdown trail and the machine-readable stores
 * is exactly what left `self-heal-log.json` at 0 entries for a week. Non-blocking — surfaces
 * a warning so the drift gets noticed instead of accumulating unnoticed.
 */
export function checkMemoryFreshness(): FreshnessReport {
  const warnings: string[] = [];
  let healLogLastEntry: string | null = null;

  if (fs.existsSync(HEAL_LOG_PATH)) {
    const content = fs.readFileSync(HEAL_LOG_PATH, 'utf-8');
    const matches = [...content.matchAll(/## Heal Record — ([0-9T:.\-Z]+)/g)];
    if (matches.length > 0) {
      healLogLastEntry = matches[matches.length - 1][1];
    }
  }

  const selfHealLog = readSelfHealLogStore();
  const patternStore = readMemoryStore();

  if (healLogLastEntry) {
    if (new Date(selfHealLog.lastUpdated) < new Date(healLogLastEntry)) {
      warnings.push(
        `memory/self-heal-log.json (lastUpdated ${selfHealLog.lastUpdated}) is behind heal-log.md's latest record (${healLogLastEntry}) — run \`npm run sync:memory\` or append via appendSelfHealLogEntry().`
      );
    }
    if (new Date(patternStore.lastUpdated) < new Date(healLogLastEntry)) {
      warnings.push(
        `memory/healed-patterns.json (lastUpdated ${patternStore.lastUpdated}) is behind heal-log.md's latest record (${healLogLastEntry}) — review recent heals for distillable patterns/anti-patterns.`
      );
    }
  }

  return {
    stale: warnings.length > 0,
    healLogLastEntry,
    selfHealLogLastUpdated: selfHealLog.lastUpdated,
    patternStoreLastUpdated: patternStore.lastUpdated,
    warnings,
  };
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
// GAP-010 fix (2026-08-21): the table now carries a real `Status` column
// (open/resolved/wontfix) instead of a11y-report.ts guessing status by scanning
// for the literal word "resolved" in free-text description cells that nothing
// ever wrote. Appending is also deduped by (feature, page, rule, element) — a
// rescan that finds the same still-open issue no longer spawns a duplicate row,
// and finding an issue that was previously marked resolved/wontfix reopens it
// (a real regression) instead of leaving a stale "resolved" row next to a fresh
// "open" one for the same finding.

export interface A11yFindingRow {
  impact: string;
  rule: string;
  element: string;
  description: string;
  feature: string;
  page: string;
  date: string;
  status: 'open' | 'resolved' | 'wontfix';
}

const A11Y_HEADER = '# ♿ Accessibility Findings\n\n> Non-blocking a11y scan results from Agent 3 (Live Explorer).\n> Building a backlog for accessibility improvements.\n> Status lifecycle: `open` (default, or reopened if a resolved/wontfix finding recurs) → `resolved` | `wontfix` via resolveA11yFinding() / npm run a11y:report.\n\n---\n\n';
const A11Y_TABLE_HEADER = '| Impact | Rule | Element | Description | Feature | Page | Date | Status |\n|--------|------|---------|-------------|---------|------|------|--------|\n';

function a11yRowKey(r: Pick<A11yFindingRow, 'feature' | 'page' | 'rule' | 'element'>): string {
  return `${r.feature}::${r.page}::${r.rule}::${r.element}`;
}

/** Parse the `| ... |` table rows out of a11y-findings.md (skips header/separator/non-row lines). */
function parseA11yTable(content: string): A11yFindingRow[] {
  const rows: A11yFindingRow[] = [];
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || trimmed.startsWith('| Impact') || trimmed.startsWith('|--')) continue;
    const cells = trimmed.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 7) continue;
    const [impact, rule, element, description, feature, page, date, status] = cells;
    rows.push({
      impact,
      rule,
      element: element.replace(/^`|`$/g, ''),
      description,
      feature,
      page,
      date,
      status: (status === 'resolved' || status === 'wontfix' ? status : 'open') as A11yFindingRow['status'],
    });
  }
  return rows;
}

function serializeA11yRow(r: A11yFindingRow): string {
  return `| ${r.impact} | ${r.rule} | \`${r.element}\` | ${r.description.replace(/\|/g, '\\|')} | ${r.feature} | ${r.page} | ${r.date} | ${r.status} |\n`;
}

function writeA11yTable(rows: A11yFindingRow[]): void {
  fs.mkdirSync(path.dirname(A11Y_FINDINGS_PATH), { recursive: true });
  const content = A11Y_HEADER + A11Y_TABLE_HEADER + rows.map(serializeA11yRow).join('');
  fs.writeFileSync(A11Y_FINDINGS_PATH, content, 'utf-8');
}

/**
 * Append an accessibility finding to memory/a11y-findings.md — deduped and
 * status-aware (see module comment above).
 */
export function appendA11yFinding(entry: {
  feature: string;
  pageUrl: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  rule: string;
  element: string;
  description: string;
}): void {
  const existing = fs.existsSync(A11Y_FINDINGS_PATH) ? fs.readFileSync(A11Y_FINDINGS_PATH, 'utf-8') : '';
  const rows = parseA11yTable(existing);

  const today = new Date().toISOString().split('T')[0];
  const key = a11yRowKey({ feature: entry.feature, page: entry.pageUrl, rule: entry.rule, element: entry.element });
  const existingIdx = rows.findIndex((r) => a11yRowKey(r) === key);

  if (existingIdx >= 0) {
    const row = rows[existingIdx];
    if (row.status !== 'open') {
      // Previously resolved/wontfix, but the same finding was just observed again — reopen it.
      row.status = 'open';
      row.date = today;
      row.description = entry.description;
      row.impact = entry.impact;
    }
    // else: already open — leave the existing row as-is rather than duplicating it.
  } else {
    rows.push({
      impact: entry.impact,
      rule: entry.rule,
      element: entry.element,
      description: entry.description,
      feature: entry.feature,
      page: entry.pageUrl,
      date: today,
      status: 'open',
    });
  }

  writeA11yTable(rows);
}

/**
 * Mark a finding resolved or wontfix by (feature, page, rule, element) key.
 * Returns true if a matching row was found and updated, false otherwise.
 */
export function resolveA11yFinding(
  feature: string,
  pageUrl: string,
  rule: string,
  element: string,
  status: 'resolved' | 'wontfix'
): boolean {
  if (!fs.existsSync(A11Y_FINDINGS_PATH)) return false;
  const rows = parseA11yTable(fs.readFileSync(A11Y_FINDINGS_PATH, 'utf-8'));
  const key = a11yRowKey({ feature, page: pageUrl, rule, element });
  const row = rows.find((r) => a11yRowKey(r) === key);
  if (!row) return false;
  row.status = status;
  writeA11yTable(rows);
  return true;
}

/** Read all parsed a11y finding rows (used by scripts/a11y-report.ts). */
export function readA11yFindings(): A11yFindingRow[] {
  if (!fs.existsSync(A11Y_FINDINGS_PATH)) return [];
  return parseA11yTable(fs.readFileSync(A11Y_FINDINGS_PATH, 'utf-8'));
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

function ensureMemoryFile(filePath: string, header: string): void {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, header, 'utf-8');
  }
}
