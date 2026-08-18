/**
 * Global Setup — Runs once before all test suites.
 *
 * Creates authenticated browser sessions (storageState) for:
 * - Admin user → tests/.auth/admin.json
 * - Customer user → tests/.auth/customer.json
 *
 * This avoids logging in before every test, speeding up the suite significantly.
 */
import { chromium, FullConfig, BrowserContext } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { ENV } from '../utils/env';
import { dismissAllModals } from '../utils/helpers';

const AUTH_DIR = path.join(__dirname, '.auth');
const CACHE_MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours
const SETUP_STATUS_PATH = path.join(process.cwd(), 'reports', 'generated', 'setup-status.json');

interface AuthSetupResult {
  role: 'admin' | 'customer';
  success: boolean;
  error?: string;
  timestamp: string;
}

/**
 * Confirms an authenticated session actually exists, rather than trusting that
 * clicking "a" login button didn't throw. NopCommerce only sets `.Nop.Authentication`
 * after a real credential-checked sign-in — the page can otherwise silently stay on
 * /login (e.g. a click landing on the wrong `type="submit"` button elsewhere on the
 * page) without Playwright ever raising an exception.
 */
async function hasAuthCookie(context: BrowserContext): Promise<boolean> {
  const cookies = await context.cookies();
  return cookies.some((c) => c.name === '.Nop.Authentication');
}

function writeSetupStatus(results: AuthSetupResult[]): void {
  try {
    fs.mkdirSync(path.dirname(SETUP_STATUS_PATH), { recursive: true });
    fs.writeFileSync(SETUP_STATUS_PATH, JSON.stringify({ results }, null, 2));
  } catch {
    // Non-fatal — the report will just render without setup-health data.
  }
}

function isAuthStateValid(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;
  try {
    const stats = fs.statSync(filePath);
    const age = Date.now() - stats.mtimeMs;
    if (age > CACHE_MAX_AGE_MS) return false;

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!Array.isArray(content.cookies) || content.cookies.length === 0) return false;
    // A cookie jar with cookies isn't proof of a logged-in session — require the
    // actual NopCommerce auth cookie, otherwise a cached "successful-looking" but
    // unauthenticated state would keep being reused for up to CACHE_MAX_AGE_MS.
    return content.cookies.some((c: { name: string }) => c.name === '.Nop.Authentication');
  } catch {
    return false;
  }
}

async function globalSetup(config: FullConfig) {
  console.log('\n🚀 Global Setup — Creating auth states...\n');

  // Ensure auth directory exists
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const adminAuthPath = path.join(AUTH_DIR, 'admin.json');
  const customerAuthPath = path.join(AUTH_DIR, 'customer.json');

  if (isAuthStateValid(adminAuthPath) && isAuthStateValid(customerAuthPath)) {
    console.log('⚡ Fresh auth state cache found (verified sessions). Skipping re-authentication!\n');
    const now = new Date().toISOString();
    writeSetupStatus([
      { role: 'admin', success: true, timestamp: now },
      { role: 'customer', success: true, timestamp: now },
    ]);
    return;
  }

  const browser = await chromium.launch();
  const setupResults: AuthSetupResult[] = [];

  // ─── Create Admin Auth State ───
  console.log('🔐 Setting up admin authentication...');
  try {
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    await adminPage.goto(`${ENV.BASE_URL}/login?returnUrl=%2FAdmin`);
    await adminPage.waitForLoadState('networkidle');
    await dismissAllModals(adminPage);

    await adminPage.locator('#Email').fill(ENV.ADMIN_EMAIL);
    await adminPage.locator('#Password').fill(ENV.ADMIN_PASSWORD);
    // NOTE: must be scoped to `.login-button` only. The generic `button[type="submit"]`
    // also matches the storefront's header search button (empty label), which sits
    // earlier in the DOM — `.first()` used to click THAT instead of "Sign In!", so the
    // login form was never submitted and no exception was ever thrown.
    await adminPage.locator('button.login-button').first().click();

    await adminPage.waitForLoadState('networkidle');
    await adminPage.waitForTimeout(3000); // Allow redirects to complete

    if (!(await hasAuthCookie(adminContext))) {
      throw new Error(
        `Login form submitted but no ".Nop.Authentication" cookie was set — credentials were ` +
        `rejected or the form didn't actually submit. Final URL: ${adminPage.url()}`
      );
    }

    await adminContext.storageState({ path: path.join(AUTH_DIR, 'admin.json') });
    console.log('✅ Admin auth state saved (session verified)');
    await adminContext.close();
    setupResults.push({ role: 'admin', success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    const message = (error as Error).message;
    console.error('❌ Admin auth setup FAILED:', message);
    console.error('   → All admin-chromium tests and any test reusing tests/.auth/admin.json will run unauthenticated.');
    fs.writeFileSync(
      path.join(AUTH_DIR, 'admin.json'),
      JSON.stringify({ cookies: [], origins: [] })
    );
    setupResults.push({ role: 'admin', success: false, error: message, timestamp: new Date().toISOString() });
  }

  // ─── Create Customer Auth State ───
  console.log('🔐 Setting up customer authentication...');
  if (ENV.CUSTOMER_EMAIL && ENV.CUSTOMER_PASSWORD) {
    try {
      const customerContext = await browser.newContext();
      const customerPage = await customerContext.newPage();

      await customerPage.goto(`${ENV.BASE_URL}/login`);
      await customerPage.waitForLoadState('networkidle');
      await dismissAllModals(customerPage);

      await customerPage.locator('#Email').fill(ENV.CUSTOMER_EMAIL);
      await customerPage.locator('#Password').fill(ENV.CUSTOMER_PASSWORD);
      await customerPage.locator('button.login-button').first().click();

      await customerPage.waitForLoadState('networkidle');
      await customerPage.waitForTimeout(2000);

      if (!(await hasAuthCookie(customerContext))) {
        throw new Error(
          `Login form submitted but no ".Nop.Authentication" cookie was set — credentials were ` +
          `rejected or the form didn't actually submit. Final URL: ${customerPage.url()}`
        );
      }

      await customerContext.storageState({ path: path.join(AUTH_DIR, 'customer.json') });
      console.log('✅ Customer auth state saved (session verified)');
      await customerContext.close();
      setupResults.push({ role: 'customer', success: true, timestamp: new Date().toISOString() });
    } catch (error) {
      const message = (error as Error).message;
      console.error('❌ Customer auth setup FAILED:', message);
      fs.writeFileSync(
        path.join(AUTH_DIR, 'customer.json'),
        JSON.stringify({ cookies: [], origins: [] })
      );
      setupResults.push({ role: 'customer', success: false, error: message, timestamp: new Date().toISOString() });
    }
  } else {
    console.warn('⚠️ Customer credentials not configured. Creating empty auth state.');
    fs.writeFileSync(
      path.join(AUTH_DIR, 'customer.json'),
      JSON.stringify({ cookies: [], origins: [] })
    );
  }

  // ─── Ensure report directories exist ───
  fs.mkdirSync(path.join(process.cwd(), 'reports', 'generated'), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), 'screenshots'), { recursive: true });

  writeSetupStatus(setupResults);

  await browser.close();
  console.log('\n🏁 Global setup complete.\n');
}

export default globalSetup;
