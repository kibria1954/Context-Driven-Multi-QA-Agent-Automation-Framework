/**
 * Global Teardown — Runs once after all test suites.
 *
 * Handles post-test cleanup:
 * - Removes stale screenshots older than 7 days
 * - Triggers Loop C pattern distillation
 *
 * Does NOT generate the custom executive HTML/Markdown report — see
 * reporters/custom-report-reporter.ts for why that structurally cannot live
 * here. In short: Playwright fully unwinds the globalTeardown task before it
 * ever calls a reporter's onEnd(), so this hook runs before the JSON
 * reporter's file has been written for THIS run, no matter how long you wait.
 * A previous version of this file tried to paper over that with a bounded
 * freshness-poll and still produced a wrong report under real load (e.g.
 * "0/1 passed" immediately after a run that actually passed 17/18) — because
 * it was polling for a write that hadn't started yet, not one that was merely
 * slow. Report generation now happens in reporters/custom-report-reporter.ts,
 * registered after 'json' in playwright.config.ts's reporter array, where
 * Playwright's own reporter-ordering guarantee (each onEnd() is awaited
 * before the next reporter's onEnd() runs) makes freshness automatic.
 */
import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { runDistillation } from '../scripts/distill-patterns';

async function globalTeardown(_config: FullConfig) {
  console.log('\n🧹 Global Teardown — Cleaning up orphaned test artifacts...');

  // ─── Screenshot retention cleanup ────────────────────────────────────────────
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  const MAX_RETENTION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  try {
    if (fs.existsSync(screenshotsDir)) {
      const files = fs.readdirSync(screenshotsDir);
      let removedCount = 0;
      for (const file of files) {
        const filePath = path.join(screenshotsDir, file);
        const stats = fs.statSync(filePath);
        if (Date.now() - stats.mtimeMs > MAX_RETENTION_MS) {
          fs.unlinkSync(filePath);
          removedCount++;
        }
      }
      if (removedCount > 0) {
        console.log(`🗑️ Removed ${removedCount} stale screenshot(s) older than 7 days.`);
      }
    }
  } catch (error) {
    console.warn('⚠️ Teardown artifact cleanup warning:', (error as Error).message);
  }

  // ─── Loop C — Pattern distillation auto-trigger (GAP-006) ───────────────────
  // Previously this only ran via a manual `npm run distill:patterns` invocation,
  // so promotion/demotion of patterns in healed-patterns.json silently went stale
  // between runs unless someone remembered to run it by hand. Running it here,
  // right after heal-log.md/self-heal-log.json have settled for this run, makes
  // it a real auto-trigger instead of a manual chore.
  try {
    runDistillation();
  } catch (error) {
    console.warn('⚠️ Loop C distillation warning:', (error as Error).message);
  }

  console.log('✅ Teardown complete.\n');
}

export default globalTeardown;
