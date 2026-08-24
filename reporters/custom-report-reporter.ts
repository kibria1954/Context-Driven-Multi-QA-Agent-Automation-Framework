/**
 * Custom Playwright Reporter — generates the executive HTML/Markdown dashboard
 * (reports/generated/{story}-report.{html,md}) once a run finishes.
 *
 * WHY A REPORTER AND NOT tests/global-teardown.ts:
 * Playwright's runner treats `globalTeardown` as a `teardown` step inside the
 * global-setup task stack, and that whole stack is fully unwound BEFORE
 * `reporter.onEnd()` is ever called for ANY reporter — confirmed against
 * node_modules/playwright/lib/runner/index.js: `runTasks()` awaits
 * `taskRunner.run()` (which is what executes globalTeardown) and only calls
 * `testRun.reporter.onEnd(...)` afterwards, inside `finishTaskRun()`.
 * That means globalTeardown can NEVER reliably observe the built-in `json`
 * reporter's finished output — not "sometimes under load", structurally never,
 * regardless of how long or how cleverly you poll for it. A prior fix tried
 * a bounded freshness-poll (matching `config.argv`) from inside
 * tests/global-teardown.ts; it still produced a wrong report (e.g. "0/1
 * passed" after a run that actually passed 17/18) because it was polling for
 * a write that structurally hadn't started yet.
 *
 * Reporters, unlike globalTeardown, DO carry an ordering guarantee:
 * Playwright's internal Multiplexer calls each registered reporter's onEnd()
 * one at a time and awaits it before invoking the next (same file, the
 * `InternalReporter`/Multiplexer `onEnd` loop). So as long as this reporter is
 * listed AFTER 'json' in playwright.config.ts's `reporter: [...]` array,
 * reports/generated/test-results.json is guaranteed fully written on disk
 * before this class's onEnd() runs. No timing guesswork required.
 */
import type { Reporter, FullConfig, FullResult, Suite } from '@playwright/test/reporter';
import * as path from 'path';
import { generateCustomReport } from '../scripts/generate-report';

/** Walks the suite tree Playwright hands us and collects one story slug per *.spec.ts file that actually ran. */
function discoverStoriesInSuite(root: Suite): string[] {
  const stories = new Set<string>();

  const walk = (suite: Suite) => {
    if (suite.type === 'file') {
      // Per the Reporter API, a file-type suite's `title` IS the spec file's path.
      const match = path.basename(suite.title).match(/^(.+)\.spec\.ts$/);
      if (match) stories.add(match[1]);
    }
    for (const child of suite.suites) walk(child);
  };

  walk(root);
  return Array.from(stories);
}

class CustomReportReporter implements Reporter {
  private rootSuite: Suite | undefined;

  onBegin(_config: FullConfig, suite: Suite): void {
    this.rootSuite = suite;
  }

  onEnd(_result: FullResult): void {
    if (!this.rootSuite) return;

    const stories = discoverStoriesInSuite(this.rootSuite);
    if (stories.length === 0) {
      console.warn('⚠️ Custom report reporter: no *.spec.ts story file found in this run — skipping dashboard generation.');
      return;
    }

    for (const story of stories) {
      try {
        generateCustomReport(story);
      } catch (error) {
        console.warn(`⚠️ Custom report generation failed for "${story}":`, (error as Error).message);
      }
    }
  }
}

export default CustomReportReporter;
