/**
 * distill-patterns.ts — Loop C Pattern Distillation Trigger (GAP-006)
 *
 * Checks heal-log.md for records since the last distillation run and evaluates
 * whether any new heals qualify for pattern promotion/demotion in healed-patterns.json.
 *
 * This script performs MECHANICAL checks only — it does NOT invent new patterns.
 * It handles:
 *   1. Promote CANDIDATE → TRUSTED if successCount >= 3 across >= 2 features
 *   2. Promote RAW → CANDIDATE if successCount >= 1
 *   3. Demote TRUSTED → DEPRECATED if failureCount >= 2 (regression)
 *   4. Reports patterns that have new heal-log entries since lastValidated
 *      → These need HUMAN/AI review for potential distillation
 *
 * Full distillation (creating NEW patterns from heals) requires AI judgment and
 * is NOT automated here. This script surfaces CANDIDATES for that review.
 *
 * `runDistillation()` is called automatically from `tests/global-teardown.ts`
 * after every test run — this is the auto-trigger fix for GAP-006 (previously
 * this was a fully manual `npm run distill:patterns` chore with no pipeline hook).
 * It's also still runnable standalone: `npx ts-node scripts/distill-patterns.ts`.
 */
import * as fs from 'fs';
import * as path from 'path';
import {
  readMemoryStore,
  saveMemoryStore,
  checkMemoryFreshness,
} from '../utils/memory-helpers';

const ROOT = path.resolve(__dirname, '..');
const HEAL_LOG_PATH = path.join(ROOT, 'memory', 'heal-log.md');
const PATTERN_LIBRARY_PATH = path.join(ROOT, 'memory', 'pattern-library.md');

// ─── Parse heal-log.md for recent entries ─────────────────────────────────────
function parseNewHealEntries(sinceDate: string): string[] {
  if (!fs.existsSync(HEAL_LOG_PATH)) return [];
  const content = fs.readFileSync(HEAL_LOG_PATH, 'utf-8');
  const blocks = content
    .split('## Heal Record — ')
    .slice(1) // skip the part before the first record
    .map((b) => '## Heal Record — ' + b);

  return blocks
    .filter((b) => {
      const m = b.match(/## Heal Record — ([\d\-T:.Z]+)/);
      return m && m[1] > sinceDate;
    })
    .map((b) => {
      const fcMatch = b.match(/\*\*Failure Class:\*\*\s*`([^`]*)`/);
      return fcMatch ? fcMatch[1] : 'UNKNOWN';
    });
}

export interface DistillationResult {
  promotions: number;
  demotions: number;
  unchanged: number;
  needsHumanReview: string[];
}

export function runDistillation(): DistillationResult {
  console.log('\n🧬 Loop C — Pattern Distillation Check');
  console.log('─'.repeat(50));

  // ─── Step 1: Check for stale memory drift ──────────────────────────────────
  const freshness = checkMemoryFreshness();
  if (freshness.stale) {
    console.warn('\n⚠️  Memory drift detected — run `npm run sync:memory` first:');
    freshness.warnings.forEach((w) => console.warn(`   - ${w}`));
    console.warn('   Continuing with existing data, but distillation may be incomplete.\n');
  }

  // ─── Step 2: Evaluate promotion/demotion rules ─────────────────────────────
  const store = readMemoryStore();
  let promotions = 0;
  let demotions = 0;
  let unchanged = 0;
  const needsHumanReview: string[] = [];

  for (const pattern of store.patterns) {
    // Demotion check: TRUSTED → DEPRECATED on repeated failures
    if (pattern.status === 'TRUSTED' && pattern.failureCount >= 2) {
      (pattern as any).status = 'DEPRECATED';
      console.warn(`  ⬇️  DEMOTE: ${pattern.patternId} TRUSTED → DEPRECATED (failureCount=${pattern.failureCount})`);
      demotions++;
      continue;
    }

    // RAW → CANDIDATE
    if (pattern.status === 'RAW' && pattern.successCount >= 1) {
      (pattern as any).status = 'CANDIDATE';
      console.log(`  ⬆️  PROMOTE: ${pattern.patternId} RAW → CANDIDATE (successCount=${pattern.successCount})`);
      promotions++;
      continue;
    }

    // CANDIDATE → TRUSTED: require successCount >= 3 across >= 2 features
    if (pattern.status === 'CANDIDATE') {
      const observedFeatures: string[] = (pattern as any).observedInFeatures ?? [];
      const crossFeature = observedFeatures.length >= 2;
      if (pattern.successCount >= 3 && crossFeature) {
        (pattern as any).status = 'TRUSTED';
        console.log(`  ⬆️  PROMOTE: ${pattern.patternId} CANDIDATE → TRUSTED (count=${pattern.successCount}, features=${observedFeatures.join(',')})`);
        promotions++;
      } else {
        const missing: string[] = [];
        if (pattern.successCount < 3) missing.push(`needs ${3 - pattern.successCount} more successes`);
        if (!crossFeature) missing.push(`needs ${2 - observedFeatures.length} more feature(s)`);
        console.log(`  ⏳ CANDIDATE ${pattern.patternId}: ${missing.join('; ')}`);
        unchanged++;
      }
      continue;
    }

    unchanged++;
  }

  // ─── Step 3: Check for heal-log entries since any pattern's lastValidated ──
  const now = new Date().toISOString();
  for (const pattern of store.patterns) {
    if (pattern.status === 'DEPRECATED') continue;
    const newHeals = parseNewHealEntries(pattern.lastValidated);
    if (newHeals.length > 0) {
      needsHumanReview.push(
        `${pattern.patternId} (${newHeals.length} new heal(s) since ${pattern.lastValidated}): ${newHeals.join(', ')}`
      );
    }
  }

  // ─── Step 4: Check for anti-pattern fast-track ─────────────────────────────
  // SETUP_INFRA_ISSUE heals in heal-log → should always be reviewed for ANTI-PATTERN distillation
  const infraHeals = parseNewHealEntries(
    store.patterns.reduce((min, p) => (p.lastValidated < min ? p.lastValidated : min), now)
  ).filter((fc) => fc === 'SETUP_INFRA_ISSUE');

  if (infraHeals.length > 0) {
    console.warn(`\n  🔴 ${infraHeals.length} SETUP_INFRA_ISSUE heal(s) found — review for new ANTI-PATTERN distillation`);
    needsHumanReview.push(`SETUP_INFRA_ISSUE heals need anti-pattern review: ${infraHeals.length} entries`);
  }

  // ─── Step 5: Save updated store if changes were made ───────────────────────
  if (promotions > 0 || demotions > 0) {
    saveMemoryStore(store);
    console.log(`\n  💾 Updated healed-patterns.json: ${promotions} promotion(s), ${demotions} demotion(s)`);
  } else {
    console.log(`\n  ✅ No lifecycle changes needed (${unchanged} pattern(s) unchanged)`);
  }

  // ─── Step 6: Output human-review queue ─────────────────────────────────────
  if (needsHumanReview.length > 0) {
    console.log('\n📋 Patterns needing human/AI review for new distillation:');
    needsHumanReview.forEach((item, i) => console.log(`   ${i + 1}. ${item}`));
    console.log('\n   → Run Agent ∞ (09-learning-prevention/SKILL.md) to process these.');
  } else {
    console.log('  ✅ No patterns require human distillation review.');
  }

  // ─── Step 7: Update pattern library MD timestamp ───────────────────────────
  if (fs.existsSync(PATTERN_LIBRARY_PATH)) {
    const content = fs.readFileSync(PATTERN_LIBRARY_PATH, 'utf-8');
    const updated = content.replace(
      /> Last distillation check: .+/,
      `> Last distillation check: \`${now}\` — ${promotions} promotion(s), ${demotions} demotion(s)`
    );
    if (updated !== content) {
      fs.writeFileSync(PATTERN_LIBRARY_PATH, updated, 'utf-8');
    }
  }

  console.log('\n✅ Distillation check complete.\n');
  return { promotions, demotions, unchanged, needsHumanReview };
}

// CLI Execution Support
if (require.main === module) {
  runDistillation();
}
