/**
 * cleanup-check.ts — Test Data Leftover Detection (IMP-008)
 *
 * Scans testdata/{feature}/cleanup-log.json for entities marked
 * cleanupRequired: true without a corresponding cleanupConfirmedAt timestamp.
 * These are "orphaned" test accounts/records that may pollute subsequent runs.
 *
 * Run: npx ts-node scripts/cleanup-check.ts
 * Wired into Stage 0 gate condition per SKILL.md.
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const TESTDATA_DIR = path.join(ROOT, 'testdata');

console.log('\n🧹 Test Data Cleanup Check');
console.log('─'.repeat(50));

if (!fs.existsSync(TESTDATA_DIR)) {
  console.log('  ℹ️  No testdata/ directory found — nothing to check.\n');
  process.exit(0);
}

const features = fs.readdirSync(TESTDATA_DIR).filter((f) => {
  return fs.statSync(path.join(TESTDATA_DIR, f)).isDirectory();
});

let totalOrphaned = 0;

for (const feature of features) {
  const cleanupLogPath = path.join(TESTDATA_DIR, feature, 'cleanup-log.json');
  if (!fs.existsSync(cleanupLogPath)) continue;

  let cleanupLog: any[];
  try {
    cleanupLog = JSON.parse(fs.readFileSync(cleanupLogPath, 'utf-8'));
  } catch {
    console.warn(`  ⚠️  ${feature}/cleanup-log.json is invalid JSON — skipping.`);
    continue;
  }

  const orphaned = cleanupLog.filter(
    (entry: any) => entry.cleanupRequired === true && !entry.cleanupConfirmedAt
  );

  if (orphaned.length > 0) {
    console.warn(`\n  ❌ ${feature}: ${orphaned.length} unconfirmed cleanup entity(ies):`);
    orphaned.forEach((e: any, i: number) => {
      console.warn(`     ${i + 1}. ${e.type ?? 'unknown'}: ${e.identifier ?? JSON.stringify(e)}`);
      console.warn(`        Created: ${e.createdAt ?? 'unknown'}`);
    });
    totalOrphaned += orphaned.length;
  } else {
    console.log(`  ✅ ${feature}: All cleanup entries confirmed.`);
  }
}

if (features.length === 0) {
  console.log('  ℹ️  No feature testdata directories found.\n');
}

if (totalOrphaned > 0) {
  console.warn(
    `\n⚠️  ${totalOrphaned} orphaned test data entity(ies) detected.\n` +
    `   These may cause TEST_DATA_ISSUE failures in the next run.\n` +
    `   Resolution options:\n` +
    `     1. Delete the test entity manually and mark cleanupConfirmedAt in cleanup-log.json\n` +
    `     2. Re-run global-teardown.ts cleanup logic if available\n`
  );
} else {
  console.log('\n✅ No orphaned test data found.\n');
}
