/**
 * verify-auth.ts — Pre-flight Auth Cookie Validity Check (GAP-009)
 *
 * Reads tests/.auth/customer.json and tests/.auth/admin.json and asserts that
 * the critical .Nop.Authentication session cookie is present in each storageState
 * file. Exits non-zero if validation fails so `npm pretest` gates the test run.
 *
 * Does NOT re-run global-setup — just validates the files already on disk.
 * If files are missing or stale, warns and exits 0 (non-blocking in CI where
 * global-setup runs fresh every time). Only fails on files that EXIST but are
 * clearly broken (no auth cookie present).
 *
 * Run: npx ts-node scripts/verify-auth.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const AUTH_DIR = path.join(ROOT, 'tests', '.auth');

interface CookieEntry {
  name: string;
  value: string;
  domain?: string;
  expires?: number;
}

interface StorageState {
  cookies?: CookieEntry[];
  origins?: any[];
}

const AUTH_COOKIE_NAME = '.Nop.Authentication';
const STALE_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours

function checkAuthFile(filename: string, role: string): boolean {
  const filePath = path.join(AUTH_DIR, filename);

  if (!fs.existsSync(filePath)) {
    // Missing is OK — global-setup will create it. Only EXISTING but broken files fail.
    console.log(`  ℹ️  ${role}: ${filename} not yet created — global-setup will run.`);
    return true;
  }

  let state: StorageState;
  try {
    state = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    console.error(`  ❌ ${role}: ${filename} exists but is not valid JSON — delete it and re-run.`);
    return false;
  }

  const cookies = state.cookies ?? [];
  const authCookie = cookies.find((c) => c.name === AUTH_COOKIE_NAME);

  if (!authCookie || !authCookie.value) {
    console.error(
      `  ❌ ${role}: ${filename} has NO ${AUTH_COOKIE_NAME} cookie — authentication failed during global-setup.\n` +
      `     Delete tests/.auth/${filename} and re-run to force re-authentication.`
    );
    return false;
  }

  // Check expiry if present
  if (authCookie.expires && authCookie.expires !== -1) {
    const expiresMs = authCookie.expires * 1000;
    if (Date.now() > expiresMs) {
      console.warn(
        `  ⚠️  ${role}: ${filename} auth cookie expired at ${new Date(expiresMs).toISOString()} — re-authentication will run.`
      );
      // Not a hard failure — global-setup will refresh it
      return true;
    }
  }

  // Check file age (2-hour cache window — matches global-setup.ts logic)
  const stats = fs.statSync(filePath);
  const ageMs = Date.now() - stats.mtimeMs;
  if (ageMs > STALE_THRESHOLD_MS) {
    console.warn(
      `  ⚠️  ${role}: ${filename} is ${Math.round(ageMs / 60000)} minutes old (> 2h) — may be refreshed by global-setup.`
    );
  } else {
    console.log(`  ✅ ${role}: ${filename} — ${AUTH_COOKIE_NAME} cookie present (age: ${Math.round(ageMs / 60000)}m)`);
  }

  return true;
}

console.log('\n🔐 Pre-flight Auth Validation');
const results = [
  checkAuthFile('customer.json', 'Customer'),
  checkAuthFile('admin.json', 'Admin'),
];

const allPassed = results.every(Boolean);
if (!allPassed) {
  console.error('\n❌ Auth pre-flight FAILED — fix auth files before running tests.\n');
  process.exit(1);
} else {
  console.log('✅ Auth pre-flight passed.\n');
}
