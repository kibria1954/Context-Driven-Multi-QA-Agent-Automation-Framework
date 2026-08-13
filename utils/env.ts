/**
 * Type-safe environment variable access.
 * Validates required variables at import time to fail fast on misconfiguration.
 *
 * Usage: import { ENV } from '../utils/env';
 */
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load the appropriate .env file
const envFile = process.env.ENV === 'prod' ? '.env.prod' : '.env.staging';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${key}\n` +
      `   Check your ${envFile} file.`
    );
  }
  return value;
}

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export const ENV = {
  // URLs
  BASE_URL: requireEnv('BASE_URL'),
  ADMIN_URL: optionalEnv('ADMIN_URL', `${requireEnv('BASE_URL')}/Admin`),

  // Credentials — Admin
  ADMIN_EMAIL: requireEnv('ADMIN_EMAIL'),
  ADMIN_PASSWORD: requireEnv('ADMIN_PASSWORD'),

  // Credentials — Customer
  CUSTOMER_EMAIL: optionalEnv('CUSTOMER_EMAIL', ''),
  CUSTOMER_PASSWORD: optionalEnv('CUSTOMER_PASSWORD', ''),

  // Playwright
  HEADLESS: optionalEnv('HEADLESS', 'true') === 'true',
  SLOW_MO: parseInt(optionalEnv('SLOW_MO', '0'), 10),
  DEFAULT_TIMEOUT: parseInt(optionalEnv('DEFAULT_TIMEOUT', '30000'), 10),
  NAVIGATION_TIMEOUT: parseInt(optionalEnv('NAVIGATION_TIMEOUT', '60000'), 10),

  // Reporting
  ALLURE_RESULTS_DIR: optionalEnv('ALLURE_RESULTS_DIR', 'allure-results'),

  // Rate limiting
  REQUEST_DELAY_MS: parseInt(optionalEnv('REQUEST_DELAY_MS', '500'), 10),

  // Loop Engineering
  MAX_LOOP_A_ITERATIONS: parseInt(optionalEnv('MAX_LOOP_A_ITERATIONS', '5'), 10),
  MAX_LOOP_B_ITERATIONS: parseInt(optionalEnv('MAX_LOOP_B_ITERATIONS', '5'), 10),

  // Meta
  ENV_NAME: optionalEnv('ENV', 'staging'),
  IS_CI: !!process.env.CI,
} as const;
