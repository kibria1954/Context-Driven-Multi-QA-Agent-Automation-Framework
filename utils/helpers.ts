/**
 * Common helper utilities for QA automation.
 * Site-specific helpers for the KBD NopCommerce store.
 *
 * These functions handle NopCommerce-specific UI patterns:
 *   - AJAX loading spinners
 *   - Welcome/newsletter modals
 *   - Cookie consent bars
 *   - Bar notifications (success/error toasts)
 */
import { Page, expect } from '@playwright/test';
import { COMMON_SELECTORS, sel } from './selectors';

// ─── Page State Helpers ──────────────────────────────────────────────────────

/**
 * Wait for the page to reach network idle state.
 * Useful after navigation or AJAX-heavy operations.
 */
export async function waitForNetworkIdle(page: Page, timeout = 10000): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout });
  } catch {
    // Network may not reach idle on AJAX-heavy pages — continue
  }
}

/**
 * Wait for AJAX loaders to disappear.
 * NopCommerce shows .ajax-loading-block-window during AJAX operations.
 */
export async function waitForAjaxComplete(page: Page, timeout = 15000): Promise<void> {
  const loader = page.locator(sel(COMMON_SELECTORS.ajaxLoader));
  try {
    await loader.waitFor({ state: 'visible', timeout: 2000 });
    await loader.waitFor({ state: 'hidden', timeout });
  } catch {
    // Loader may not appear for fast operations — that's fine
  }
}

/**
 * Dismiss any modal/popup that may appear (welcome, newsletter, cookie consent).
 * Silently succeeds if no modal is present.
 */
export async function dismissAllModals(page: Page): Promise<void> {
  // 1. Check "Don't show again" checkbox/option first if present
  try {
    const dontShowSelectors = [
      'input[type="checkbox"][name*="dont-show"]',
      'input[type="checkbox"][id*="dont-show"]',
      'input[type="checkbox"][class*="dont-show"]',
      'label:has-text("Don\'t show again")',
      'label:has-text("Do not show again")',
      '.dont-show-again input',
      '#dont-show-again',
    ];
    for (const selector of dontShowSelectors) {
      const checkbox = page.locator(selector).first();
      if (await checkbox.isVisible({ timeout: 400 }).catch(() => false)) {
        const isChecked = await checkbox.isChecked().catch(() => false);
        if (!isChecked) {
          await checkbox.check({ force: true }).catch(() => checkbox.click({ force: true }));
          await page.waitForTimeout(300);
        }
      }
    }
  } catch {
    // Continue
  }

  // 2. Count and close all popup close buttons iteratively
  try {
    const closeSelectors = [
      '#multi-popup-overlay .close',
      '.multi-popup-close',
      '.close-popup-button',
      'button.mfp-close',
      '.modal-close',
      '[aria-label="Close"]',
      'button.close',
      '.close-button',
      '.popup-close',
    ];

    let closedCount = 0;
    for (const selector of closeSelectors) {
      const closeBtns = page.locator(selector);
      const count = await closeBtns.count().catch(() => 0);
      for (let i = 0; i < count; i++) {
        const btn = closeBtns.nth(i);
        if (await btn.isVisible({ timeout: 300 }).catch(() => false)) {
          await btn.click({ force: true }).catch(() => {});
          closedCount++;
          await page.waitForTimeout(300);
        }
      }
    }
    if (closedCount > 0) {
      console.log(`\n🧹 Dismissed ${closedCount} popup modal(s).`);
    }
  } catch {
    // Continue
  }

  // 3. Fallback: Remove any remaining popup overlays via DOM manipulation
  try {
    await page.evaluate(() => {
      const popups = document.querySelectorAll(
        '#kdn-welcome-modal, #multi-popup-overlay, .multi-popup-overlay, .kdn-welcome-modal-overlay, .modal-backdrop, .mfp-bg, .mfp-wrap, [id*="popup"], [class*="popup-overlay"], .newsletter-popup-overlay, .news-letter-popup-modal, .ui-widget-overlay'
      );
      popups.forEach((el) => el.remove());

      // Re-enable scrolling and clear open modal classes
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.classList.remove('modal-open', 'popup-open', 'mfp-zoom-out-cur');
    });
  } catch {
    // Continue
  }

  // 4. Try cookie consent accept if visible
  try {
    const cookie = page.locator(sel(COMMON_SELECTORS.cookieConsent));
    if (await cookie.isVisible({ timeout: 400 })) {
      const acceptBtn = page.locator(sel(COMMON_SELECTORS.cookieAcceptButton));
      if (await acceptBtn.isVisible({ timeout: 400 })) {
        await acceptBtn.click({ force: true }).catch(() => {});
      }
    }
  } catch {
    // No cookie bar — continue
  }
}

// ─── Notification Helpers ────────────────────────────────────────────────────

/**
 * Assert that a bar notification appears with expected type and optional text.
 */
export async function assertBarNotification(
  page: Page,
  type: 'success' | 'error',
  expectedText?: string
): Promise<void> {
  const selector = type === 'success'
    ? sel(COMMON_SELECTORS.barNotificationSuccess)
    : sel(COMMON_SELECTORS.barNotificationError);

  const notification = page.locator(selector);
  await expect(notification).toBeVisible({ timeout: 10000 });

  if (expectedText) {
    await expect(notification).toContainText(expectedText);
  }
}

/**
 * Close the bar notification if visible.
 */
export async function closeBarNotification(page: Page): Promise<void> {
  try {
    const closeBtn = page.locator(sel(COMMON_SELECTORS.barNotificationClose));
    if (await closeBtn.isVisible({ timeout: 2000 })) {
      await closeBtn.click();
    }
  } catch {
    // No notification — continue
  }
}

/**
 * Get bar notification text content.
 */
export async function getBarNotificationText(page: Page): Promise<string> {
  const notification = page.locator(sel(COMMON_SELECTORS.barNotification));
  try {
    if (await notification.isVisible({ timeout: 3000 })) {
      return (await notification.textContent()) || '';
    }
  } catch {
    // No notification
  }
  return '';
}

// ─── Retry & Resilience Helpers ──────────────────────────────────────────────

/**
 * Retry an action with exponential backoff.
 * Useful for flaky network conditions or AJAX race conditions.
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        console.warn(
          `⚠️ Retry ${attempt}/${maxRetries} failed: ${lastError.message}. ` +
          `Waiting ${delay}ms before next attempt.`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error(
    `❌ Action failed after ${maxRetries} retries. Last error: ${lastError?.message}`
  );
}

// ─── Test Data Generation Helpers ────────────────────────────────────────────

/**
 * Generate a unique test email address.
 * Uses timestamp + random string to avoid collisions.
 */
export function generateTestEmail(prefix = 'test'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}.${timestamp}.${random}@qa-test.example.com`;
}

/**
 * Generate a random string of specified length.
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a valid Bangladeshi phone number for testing.
 */
export function generateTestPhoneNumber(): string {
  const prefixes = ['017', '018', '019', '016', '015', '013'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const rest = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `${prefix}${rest}`;
}

// ─── Cart Helpers ────────────────────────────────────────────────────────────

/**
 * Clear the shopping cart via UI.
 * Navigates to cart page and removes all items.
 */
export async function clearCart(page: Page): Promise<void> {
  await page.goto('/cart');
  await waitForNetworkIdle(page);

  const checkboxes = page.locator('input[name="removefromcart"]');
  const checkboxCount = await checkboxes.count();

  if (checkboxCount > 0) {
    for (let i = 0; i < checkboxCount; i++) {
      await checkboxes.nth(i).check();
    }
    await page.locator('button[name="updatecart"]').click();
    await waitForNetworkIdle(page);
  }
}

// ─── Screenshot & Evidence Helpers ───────────────────────────────────────────

/**
 * Take a named screenshot and return the buffer.
 */
export async function takeNamedScreenshot(
  page: Page,
  name: string,
  fullPage = false
): Promise<Buffer> {
  return await page.screenshot({
    path: `screenshots/${name}-${Date.now()}.png`,
    fullPage,
  });
}

// ─── Timing Helpers ──────────────────────────────────────────────────────────

/**
 * Delay execution by specified milliseconds.
 * Use sparingly — only for rate limiting in live verification loops.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Measure the execution time of an async action.
 */
export async function measureTime<T>(
  label: string,
  action: () => Promise<T>
): Promise<{ result: T; durationMs: number }> {
  const start = Date.now();
  const result = await action();
  const durationMs = Date.now() - start;
  console.log(`⏱️ ${label}: ${durationMs}ms`);
  return { result, durationMs };
}

// ─── Visual Regression Helpers ───────────────────────────────────────────────

/**
 * Assert visual layout against baseline snapshot with diff tolerance.
 */
export async function assertVisualBaseline(
  page: Page,
  snapshotName: string,
  maxDiffPixelRatio = 0.05
): Promise<void> {
  await expect(page).toHaveScreenshot(`${snapshotName}.png`, {
    maxDiffPixelRatio,
    animations: 'disabled',
  });
}

