/**
 * Playwright Configuration — Context-Driven AI QA Agent
 *
 * Multi-project setup for:
 *   - Storefront (authenticated customer)
 *   - Storefront Guest (unauthenticated — registration, login tests)
 *   - Admin Panel (authenticated admin)
 *   - Cross-browser (Firefox)
 *   - Mobile viewport (iPhone 14)
 *
 * Global setup creates auth storageState files.
 * Environment-aware: reads from .env.staging or .env.prod.
 */
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment-specific config
const envFile = process.env.ENV === 'prod' ? '.env.prod' : '.env.staging';
dotenv.config({ path: path.resolve(__dirname, envFile) });

const BASE_URL = process.env.BASE_URL || 'https://kbd.nop-station.site';
const HEADLESS = process.env.HEADLESS !== 'false';
const SLOW_MO = parseInt(process.env.SLOW_MO || '0', 10);
const DEFAULT_TIMEOUT = parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10);
const NAVIGATION_TIMEOUT = parseInt(process.env.NAVIGATION_TIMEOUT || '60000', 10);
// Cross-browser (Firefox) and mobile-viewport projects are opt-in only — an unfiltered
// `npx playwright test` should exercise Chrome only. Set CROSS_BROWSER=true to include them.
const CROSS_BROWSER = process.env.CROSS_BROWSER === 'true';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  timeout: DEFAULT_TIMEOUT,

  /* Global setup/teardown — creates auth storageState files */
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',

  /* Reporter configuration.
   * './reporters/custom-report-reporter.ts' MUST come after 'json': Playwright
   * calls each reporter's onEnd() in array order and awaits it before moving to
   * the next one, so this ordering is what guarantees reports/generated/test-results.json
   * is fully written before the custom HTML/MD dashboard reads it. See that
   * file's header comment for why this can't live in global-teardown.ts instead. */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json', { outputFile: 'reports/generated/test-results.json' }],
    ['./reporters/custom-report-reporter.ts'],
  ],

  /* Shared settings for all projects */
  use: {
    baseURL: BASE_URL,
    headless: HEADLESS,
    launchOptions: {
      slowMo: SLOW_MO,
    },
    navigationTimeout: NAVIGATION_TIMEOUT,
    actionTimeout: 15000,

    /* Collect trace, screenshot, video on failure */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',

    /* Extra HTTP headers for identification */
    extraHTTPHeaders: {
      'X-QA-Agent': 'context-driven-ai-qa-agent',
    },
  },

  /* Project-specific configurations */
  projects: [
    // ─── Storefront Tests (Authenticated Customer) ───
    {
      name: 'storefront-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/.auth/customer.json',
      },
      testMatch: /(?:catalog|cart|account|checkout)\/.+\.spec\.ts/,
    },

    // ─── Storefront Guest (Unauthenticated — Login, Registration) ───
    {
      name: 'storefront-guest',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: /(?:auth|registration)\/.+\.spec\.ts/,
    },

    // ─── Admin Panel Tests ───
    {
      name: 'admin-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/.auth/admin.json',
        baseURL: process.env.ADMIN_URL || `${BASE_URL}/Admin`,
      },
      testMatch: /admin\/.+\.spec\.ts/,
    },

    // ─── Cross-browser (Firefox) — opt-in via CROSS_BROWSER=true, excluded from default runs ───
    ...(CROSS_BROWSER ? [{
      name: 'storefront-firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
      testMatch: /(?:auth|registration)\/.+\.spec\.ts/,
    }] : []),

    // ─── Mobile viewport — opt-in via CROSS_BROWSER=true, excluded from default runs ───
    ...(CROSS_BROWSER ? [{
      name: 'storefront-mobile',
      use: {
        ...devices['iPhone 14'],
      },
      testMatch: /mobile\/.+\.spec\.ts/,
    }] : []),
  ],
});
