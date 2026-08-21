/**
 * Sync Memory — reconciles the hand-maintained `memory/heal-log.md` audit trail with the
 * machine-readable `memory/self-heal-log.json` store, and reports drift on `memory/healed-patterns.json`.
 *
 * Why this exists: `heal-log.md` is written per the exact template in
 * `06-execution-self-heal/SKILL.md`, but nothing previously kept `self-heal-log.json` (which
 * `utils/report-helpers.ts::readSelfHealLog()` feeds into the HTML report) in sync with it —
 * it sat at 0 entries while heal-log.md accumulated real records. This script is the mechanical
 * half of the fix: it parses `heal-log.md` and appends any record missing from
 * `self-heal-log.json`. Pattern *distillation* (turning heals into `healed-patterns.json`
 * lifecycle entries) is intentionally NOT automated here — that requires judgment about which
 * heals generalize into a reusable pattern vs. a one-off fix, which belongs to Agent 5 / the
 * Learning Loop (Agent ∞), not a regex script. This script only reports when that store looks
 * stale relative to heal-log.md, via `checkMemoryFreshness()`.
 *
 * Run: `npx ts-node scripts/sync-memory.ts`
 */
import * as fs from 'fs';
import * as path from 'path';
import {
  appendSelfHealLogEntry,
  readSelfHealLogStore,
  checkMemoryFreshness,
  type SelfHealLogEntry,
} from '../utils/memory-helpers';

const ROOT = path.resolve(__dirname, '..');
const HEAL_LOG_PATH = path.join(ROOT, 'memory', 'heal-log.md');

function parseHealLog(): SelfHealLogEntry[] {
  if (!fs.existsSync(HEAL_LOG_PATH)) return [];
  const content = fs.readFileSync(HEAL_LOG_PATH, 'utf-8');

  const blocks = content.split(/(?=## Heal Record — )/g).filter((b) => b.startsWith('## Heal Record'));
  const entries: SelfHealLogEntry[] = [];

  for (const block of blocks) {
    const timestampMatch = block.match(/## Heal Record — ([0-9T:.\-Z]+)/);
    const runIdMatch = block.match(/\*\*Run ID:\*\*\s*`([^`]*)`/);
    const testMatch = block.match(/\*\*Test:\*\*\s*(.+)/);
    const failureClassMatch = block.match(/\*\*Failure Class:\*\*\s*`([^`]*)`/);
    const errorMatch = block.match(/\*\*Error:\*\*\s*(.+)/);
    const actionMatch = block.match(/\*\*Action:\*\*\s*(.+)/);

    if (!timestampMatch) continue;

    const testTitle = testMatch ? testMatch[1].trim() : 'Unknown';
    const featureMatch = testTitle.match(/\(([a-z0-9-]+)(?:,|\))/i);

    entries.push({
      timestamp: timestampMatch[1],
      runId: runIdMatch ? runIdMatch[1].trim() : 'unknown-run',
      storyName: featureMatch ? featureMatch[1] : 'b2b-registration',
      iteration: 1,
      failureClass: failureClassMatch ? failureClassMatch[1].trim() : 'UNKNOWN',
      errorSnippet: errorMatch ? errorMatch[1].trim().slice(0, 300) : '',
      actionTaken: actionMatch ? actionMatch[1].trim().slice(0, 500) : '',
      testTitle,
    });
  }

  return entries;
}

function main(): void {
  const parsed = parseHealLog();
  const existing = readSelfHealLogStore();
  const existingKeys = new Set(existing.entries.map((e) => `${e.timestamp}::${e.testTitle}`));

  let added = 0;
  for (const entry of parsed) {
    const key = `${entry.timestamp}::${entry.testTitle}`;
    if (existingKeys.has(key)) continue;
    appendSelfHealLogEntry(entry);
    existingKeys.add(key);
    added++;
  }

  console.log(`✅ sync-memory: parsed ${parsed.length} heal-log.md record(s), appended ${added} new entry(ies) to self-heal-log.json.`);

  const freshness = checkMemoryFreshness();
  if (freshness.stale) {
    console.log('\n⚠️  Freshness warnings:');
    for (const w of freshness.warnings) console.log(`   - ${w}`);
  } else {
    console.log('✅ self-heal-log.json and healed-patterns.json are in sync with heal-log.md.');
  }
}

main();
