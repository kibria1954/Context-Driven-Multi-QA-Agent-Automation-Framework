/**
 * Global Setup — Runs once before all test suites.
 *
 * Creates authenticated browser sessions (storageState) for:
 * - Admin user → tests/.auth/admin.json
 * - Customer user → tests/.auth/customer.json
 *
 * This avoids logging in before every test, speeding up the suite significantly.
 */
import { chromium, FullConfig } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { ENV } from '../utils/env';
import { dismissAllModals } from '../utils/helpers';

const AUTH_DIR = path.join(__dirname, '.auth');
const CACHE_MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

function isAuthStateValid(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;
  try {
    const stats = fs.statSync(filePath);
    const age = Date.now() - stats.mtimeMs;
    if (age > CACHE_MAX_AGE_MS) return false;

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return Array.isArray(content.cookies) && content.cookies.length > 0;
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
    console.log('⚡ Fresh auth state cache found. Skipping re-authentication!\n');
    return;
  }

  const browser = await chromium.launch();

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
    await adminPage.locator('button.login-button, button[type="submit"]').first().click();

    await adminPage.waitForLoadState('networkidle');
    await adminPage.waitForTimeout(3000); // Allow redirects to complete

    await adminContext.storageState({ path: path.join(AUTH_DIR, 'admin.json') });
    console.log('✅ Admin auth state saved');
    await adminContext.close();
  } catch (error) {
    console.warn('⚠️ Admin auth setup failed:', (error as Error).message);
    fs.writeFileSync(
      path.join(AUTH_DIR, 'admin.json'),
      JSON.stringify({ cookies: [], origins: [] })
    );
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
      await customerPage.locator('button.login-button, button[type="submit"]').first().click();

      await customerPage.waitForLoadState('networkidle');
      await customerPage.waitForTimeout(2000);

      await customerContext.storageState({ path: path.join(AUTH_DIR, 'customer.json') });
      console.log('✅ Customer auth state saved');
      await customerContext.close();
    } catch (error) {
      console.warn('⚠️ Customer auth setup failed:', (error as Error).message);
      fs.writeFileSync(
        path.join(AUTH_DIR, 'customer.json'),
        JSON.stringify({ cookies: [], origins: [] })
      );
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

  await browser.close();
  console.log('\n🏁 Global setup complete.\n');
}

export default globalSetup;
