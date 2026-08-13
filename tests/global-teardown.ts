/**
 * Global Teardown — Runs once after all test suites.
 *
 * Handles post-test cleanup:
 * - Logs completion
 * - Optional: cleanup test data, generate summary
 */
import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { generateCustomReport } from '../scripts/generate-report';

async function globalTeardown(config: FullConfig) {
  console.log('\n🧹 Global Teardown — Cleaning up orphaned test artifacts...');

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

  // Automatically update Stage 8 Custom Executive HTML & Markdown Dashboard Reports
  try {
    // Wait 1000ms to ensure Playwright JSON reporter has fully flushed results to disk
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const executedSpec = config.argv?.find((a) => a.includes('.spec.ts'));
    const storyMatch = executedSpec?.match(/([^\/\\]+)\.spec\.ts/);
    const storyName = storyMatch ? storyMatch[1] : 'wishlist-management';

    generateCustomReport(storyName);
  } catch (error) {
    console.warn('⚠️ Custom report generation warning:', (error as Error).message);
  }

  console.log('✅ Teardown complete.\n');
}

export default globalTeardown;



