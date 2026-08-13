/**
 * LoginPage — Page Object for Login flow.
 * Inherits from BasePage.
 *
 * Selectors are centralized in utils/selectors.ts -> LOGIN_SELECTORS
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { LOGIN_SELECTORS, sel } from '../utils/selectors';

export class LoginPage extends BasePage {
  get path(): string {
    return '/login';
  }

  // ─── Locators (Strict Centralized Registry) ────────────────────────────────

  get emailInput() {
    return this.page.locator(sel(LOGIN_SELECTORS.emailInput));
  }

  get passwordInput() {
    return this.page.locator(sel(LOGIN_SELECTORS.passwordInput));
  }

  get rememberMeCheckbox() {
    return this.page.locator(sel(LOGIN_SELECTORS.rememberMeCheckbox));
  }

  get loginButton() {
    return this.page.locator(sel(LOGIN_SELECTORS.loginButton));
  }

  get validationSummary() {
    return this.page.locator(sel(LOGIN_SELECTORS.validationSummary));
  }

  get emailError() {
    return this.page.locator(sel(LOGIN_SELECTORS.emailValidationError));
  }

  get forgotPasswordLink() {
    return this.page.locator(sel(LOGIN_SELECTORS.forgotPasswordLink));
  }

  get registerButton() {
    return this.page.locator(sel(LOGIN_SELECTORS.registerLink));
  }

  private get pageTitle() {
    return this.page.locator(sel(LOGIN_SELECTORS.pageTitle));
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  /**
   * Login with the given email and password.
   */
  async login(email: string, password: string, rememberMe = false): Promise<void> {
    await this.dismissModals();
    const emailField = this.emailInput;
    if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
      await emailField.fill(email);
      await this.passwordInput.fill(password);

      if (rememberMe) {
        await this.rememberMeCheckbox.check({ force: true }).catch(() => {});
      }

      await this.dismissModals();
      await this.loginButton.click({ force: true });
      await this.waitForPageReady();
    }
  }

  /**
   * Login as the admin user using environment credentials.
   */
  async loginAsAdmin(): Promise<void> {
    const email = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const password = process.env.ADMIN_PASSWORD || 'admin';
    await this.login(email, password);
  }

  /**
   * Fill only the email field.
   */
  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fill only the password field.
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the Login button.
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Click "Forgot password?".
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  /**
   * Click "Register" on the login page.
   */
  async clickRegister(): Promise<void> {
    await this.registerButton.click();
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  /**
   * Assert the login page is displayed.
   */
  async assertLoginPageDisplayed(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Assert a global validation error message is shown.
   */
  async assertValidationError(expectedMessage?: string): Promise<void> {
    await expect(this.validationSummary).toBeVisible();
    if (expectedMessage) {
      await expect(this.validationSummary).toContainText(expectedMessage);
    }
  }

  /**
   * Assert field-level email error (e.g. "Wrong email").
   */
  async assertEmailError(expectedMessage?: string): Promise<void> {
    await expect(this.emailError).toBeVisible();
    if (expectedMessage) {
      await expect(this.emailError).toContainText(expectedMessage);
    }
  }
}
