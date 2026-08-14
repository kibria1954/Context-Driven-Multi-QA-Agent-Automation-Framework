/**
 * Data Provisioner — Agent 0 Test Data Factory
 *
 * Generates synthetic test data, seeds entities via API, manages tagged cleanup,
 * and detects data collisions for parallel runs.
 *
 * All created data is tagged with `qa-agent-{runId}` for scoped teardown.
 * NEVER uses real PII — all data is synthetic and locale-appropriate (BD).
 */
import * as fs from 'fs';
import * as path from 'path';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SyntheticUser {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  username: string;
  password: string;
  addressLine1: string;
  city: string;
  division: string;
  zipCode: string;
  contactName: string;
  position: string;
  websiteUrl: string;
}

export interface TestDataSeed {
  feature: string;
  generatedAt: string;
  runId: string;
  entities: Array<{
    type: string;
    data: Record<string, string | boolean | number>;
    createdVia: 'api' | 'ui' | 'fixture';
    cleanupRequired: boolean;
  }>;
}

export interface CleanupLog {
  runId: string;
  cleanedAt: string;
  entitiesCleaned: number;
  errors: string[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const BD_PHONE_PREFIXES = ['013', '015', '016', '017', '018', '019'];
const BD_DIVISIONS = ['Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Sylhet', 'Rangpur', 'Barishal', 'Mymensingh'];
const BD_CITIES = ['Dhaka', 'Chittagong', 'Gazipur', 'Narayanganj', 'Comilla', 'Sylhet', 'Rajshahi', 'Khulna'];
const FIRST_NAMES = ['Rahim', 'Karim', 'Jamal', 'Faruk', 'Nusrat', 'Tasnim', 'Anika', 'Rafi', 'Shakil', 'Mehedi'];
const LAST_NAMES = ['Ahmed', 'Hossain', 'Islam', 'Rahman', 'Akter', 'Begum', 'Khan', 'Ali', 'Mia', 'Uddin'];
const BUSINESS_TYPES = [
  'Retailer (Online page only)',
  'Retailer (Online page + physical shop)',
  'Retailer (Physical shop only)',
  'Wholesaler (Online page)',
  'Wholesaler (Physical shop)',
  'Clinic / Pharmacy',
  'Salon / Parlour',
  'Reseller',
];
const POSITIONS = ['Owner', 'Manager', 'Procurement Officer', 'Director', 'Sales Head'];

const TESTDATA_DIR = path.resolve(process.cwd(), 'testdata');

// ─── Random Helpers ──────────────────────────────────────────────────────────

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDigits(count: number): string {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

function randomAlphaNumeric(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ─── Synthetic Data Generators ───────────────────────────────────────────────

/**
 * Generate a unique run ID for data tagging and cleanup scoping.
 */
export function generateRunId(): string {
  return `qa-agent-${Date.now()}-${randomAlphaNumeric(6)}`;
}

/**
 * Generate a synthetic Bangladeshi phone number (11 digits, starts with 01).
 */
export function generateBDPhoneNumber(): string {
  return `${randomElement(BD_PHONE_PREFIXES)}${randomDigits(8)}`;
}

/**
 * Generate a unique test email that won't collide with real users.
 */
export function generateTestEmail(runId: string, prefix = 'qatest'): string {
  const timestamp = Date.now();
  const random = randomAlphaNumeric(6);
  return `${prefix}.${timestamp}.${random}@qa-test.example.com`;
}

/**
 * Generate a complete synthetic user for registration testing.
 */
export function generateSyntheticUser(runId: string): SyntheticUser {
  const firstName = randomElement(FIRST_NAMES);
  const lastName = randomElement(LAST_NAMES);
  const timestamp = Date.now();

  return {
    email: generateTestEmail(runId),
    firstName,
    lastName,
    company: `QA-Auto-${runId.slice(-8)} ${randomElement(['Corp', 'Ltd', 'Enterprise', 'Trading'])}`,
    phone: generateBDPhoneNumber(),
    username: `qa_${firstName.toLowerCase()}_${timestamp}`,
    password: `QaTest@${randomDigits(4)}!`,
    addressLine1: `${Math.floor(Math.random() * 999) + 1} ${randomElement(['Mirpur Road', 'Dhanmondi Lane', 'Gulshan Avenue', 'Uttara Sector'])}`,
    city: randomElement(BD_CITIES),
    division: randomElement(BD_DIVISIONS),
    zipCode: randomDigits(4),
    contactName: `${firstName} ${lastName}`,
    position: randomElement(POSITIONS),
    websiteUrl: `https://www.qa-test-${randomAlphaNumeric(6)}.com`,
  };
}

/**
 * Generate a random business type from the KBD registration dropdown options.
 */
export function generateBusinessType(): string {
  return randomElement(BUSINESS_TYPES);
}

// ─── Test Data Provisioning ──────────────────────────────────────────────────

/**
 * Provision test data for a feature and save to testdata/{feature}/seed.json.
 */
export function provisionTestData(feature: string, runId: string, count = 1): TestDataSeed {
  const seed: TestDataSeed = {
    feature,
    generatedAt: new Date().toISOString(),
    runId,
    entities: [],
  };

  for (let i = 0; i < count; i++) {
    const user = generateSyntheticUser(runId);
    seed.entities.push({
      type: 'customer',
      data: user as unknown as Record<string, string>,
      createdVia: 'fixture',
      cleanupRequired: true,
    });
  }

  // Save to file
  const featureDir = path.join(TESTDATA_DIR, feature);
  fs.mkdirSync(featureDir, { recursive: true });
  fs.writeFileSync(
    path.join(featureDir, 'seed.json'),
    JSON.stringify(seed, null, 2),
    'utf-8'
  );

  console.log(`📦 Agent 0: Provisioned ${count} entity/entities for ${feature} (run: ${runId})`);
  return seed;
}

/**
 * Read existing provisioned test data for a feature.
 */
export function readTestData(feature: string): TestDataSeed | null {
  const seedFile = path.join(TESTDATA_DIR, feature, 'seed.json');
  if (!fs.existsSync(seedFile)) return null;

  try {
    return JSON.parse(fs.readFileSync(seedFile, 'utf-8'));
  } catch {
    return null;
  }
}

/**
 * Log cleanup results after a test run.
 */
export function logCleanup(feature: string, runId: string, cleaned: number, errors: string[] = []): void {
  const log: CleanupLog = {
    runId,
    cleanedAt: new Date().toISOString(),
    entitiesCleaned: cleaned,
    errors,
  };

  const featureDir = path.join(TESTDATA_DIR, feature);
  fs.mkdirSync(featureDir, { recursive: true });
  fs.writeFileSync(
    path.join(featureDir, 'cleanup-log.json'),
    JSON.stringify(log, null, 2),
    'utf-8'
  );

  if (errors.length > 0) {
    console.warn(`⚠️ Agent 0: Cleanup completed with ${errors.length} error(s) for ${feature}`);
  } else {
    console.log(`🧹 Agent 0: Cleaned ${cleaned} entities for ${feature} (run: ${runId})`);
  }
}
