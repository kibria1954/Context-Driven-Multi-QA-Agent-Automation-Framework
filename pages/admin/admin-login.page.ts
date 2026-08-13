/**
 * AdminLoginPage — Page Object for admin panel authentication.
 * Admin uses the same login form as storefront but with /Admin returnUrl.
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { ADMIN_SELECTORS, sel } from '../../utils/selectors';
import { ENV } from '../../utils/env';

export class AdminLoginPage extends BasePage {
  get path(): string {
    return '/login?returnUrl=%2FAdmin';
  }

  // ─── Locators ──────────────────────────────────────────────────────────────

  private get emailInput() { return this.page.locator(sel(ADMIN_SELECTORS.emailInput)); }
  private get passwordInput() { return this.page.locator(sel(ADMIN_SELECTORS.passwordInput)); }
  private get loginButton() { return this.page.locator(sel(ADMIN_SELECTORS.loginButton)); }

  // ─── Actions ───────────────────────────────────────────────────────────────

  /**
   * Login to admin panel.
   */
  async loginAsAdmin(email?: string, password?: string): Promise<void> {
    await this.dismissModals();
    await this.emailInput.fill(email || ENV.ADMIN_EMAIL);
    await this.passwordInput.fill(password || ENV.ADMIN_PASSWORD);
    await this.loginButton.click();
    await this.waitForPageReady();
    await this.page.waitForTimeout(3000); // Allow admin dashboard to fully load
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  async assertLoginPageDisplayed(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async assertAdminDashboardReached(): Promise<void> {
    await expect(this.page).toHaveURL(/\/Admin/i, { timeout: 15000 });
  }
}
