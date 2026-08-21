/**
 * Global Teardown — Runs once after all test suites.
 *
 * Handles post-test cleanup:
 * - Removes stale screenshots older than 7 days
 * - Writes a run-history snapshot for trend analysis (Agent 7 / GAP-011)
 * - Generates the custom executive HTML/Markdown report
 */
import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { generateCustomReport } from '../scripts/generate-report';
import { runDistillation } from '../scripts/distill-patterns';

async function globalTeardown(config: FullConfig) {
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

  // ─── Report generation & run-history snapshot ────────────────────────────────
  try {
    // A fixed sleep here previously raced the JSON reporter's flush under real load —
    // report generation would run against a stale test-results.json (from an earlier
    // run) and silently under-report the pass rate. Guessing "long enough" via mtime
    // windows proved fragile. Instead, verify deterministically: the JSON reporter
    // embeds the exact process argv it ran with — if that matches THIS invocation's
    // own argv (also available on `config`), the file is unambiguously ours.
    // Poll only for the "not written yet" case.
    const resultsFile = path.join(process.cwd(), 'reports', 'generated', 'test-results.json');
    const thisRunArgv = JSON.stringify(config.argv || []);
    const POLL_INTERVAL_MS = 300;
    const MAX_WAIT_MS = 30000;
    const pollStartedAt = Date.now();

    let freshnessConfirmed = false;
    while (Date.now() - pollStartedAt < MAX_WAIT_MS) {
      try {
        const fileArgv = JSON.stringify(JSON.parse(fs.readFileSync(resultsFile, 'utf-8')).config?.argv || []);
        if (fileArgv === thisRunArgv) {
          freshnessConfirmed = true;
          break;
        }
      } catch {
        // File missing or mid-write (invalid JSON) — keep polling.
      }
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    if (!freshnessConfirmed) {
      console.warn(
        `⚠️ test-results.json still doesn't match this run's argv after waiting ${MAX_WAIT_MS}ms — ` +
        `the JSON reporter is still finalizing attachments (common in --headed runs with ` +
        `trace/video recording). The report below may reflect an earlier run, not this one.\n` +
        `   → Run "npm run report" once the terminal is idle to regenerate it from the final data.`
      );
    }

    const executedSpec = config.argv?.find((a) => a.includes('.spec.ts'));
    const storyMatch = executedSpec?.match(/([^\/\\]+)\.spec\.ts/);
    const storyName = storyMatch ? storyMatch[1] : 'wishlist-management';

    if (!freshnessConfirmed) {
      console.warn(`⚠️ Proceeding with report generation for "${storyName}" despite unconfirmed freshness (see warning above).`);
    }

    // generateCustomReport() persists this run to memory/run-history/ via
    // utils/report-helpers.ts::recordRunHistory() — that is the ONLY run-history
    // writer. (GAP-011: an earlier version of this file also wrote a second,
    // differently-shaped snapshot directly here — `{story}-{date}.json` with flat
    // `feature`/`passRate` fields — which readRunHistory() can't parse correctly
    // [it expects `{story}--{runId}.json` with `story`/`summary.passRate`]. That
    // duplicate writer silently polluted every feature's trend chart with
    // zero-value entries and has been removed; do not re-add a second writer here.)
    generateCustomReport(storyName);
  } catch (error) {
    console.warn('⚠️ Custom report generation warning:', (error as Error).message);
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
