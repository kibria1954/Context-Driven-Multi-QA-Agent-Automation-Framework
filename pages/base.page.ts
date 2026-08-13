/**
 * BasePage — Abstract base class for all Page Objects.
 *
 * Provides common navigation, waiting, modal dismissal, screenshots,
 * and header interactions that every page inherits.
 *
 * All page objects MUST extend this class and implement the `path` getter.
 */
import { Page, expect, Locator } from '@playwright/test';
import { COMMON_SELECTORS, HEADER_SELECTORS, sel } from '../utils/selectors';
import { waitForNetworkIdle, waitForAjaxComplete, dismissAllModals } from '../utils/helpers';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Each page object must define its URL path.
   * Used by navigate() for automatic navigation.
   */
  abstract get path(): string;

  // ─── Navigation ────────────────────────────────────────────────────────────

  /**
   * Navigate to this page's URL and wait for it to load.
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.path);
    await this.waitForPageReady();
  }

  /**
   * Navigate to a specific URL (absolute or relative).
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageReady();
  }

  /**
   * Get the current page URL.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  // ─── Page State ────────────────────────────────────────────────────────────

  /**
   * Wait for the page to be fully ready (network idle + no AJAX loaders).
   */
  async waitForPageReady(): Promise<void> {
    await waitForNetworkIdle(this.page, 15000);
    await waitForAjaxComplete(this.page, 5000);
  }

  /**
   * Dismiss any popup modals (welcome, newsletter, cookie consent).
   * Call this after first navigation in a session.
   */
  async dismissModals(): Promise<void> {
    await dismissAllModals(this.page);
  }

  /**
   * Get the page title from the browser tab.
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the page heading (h1) text.
   */
  async getPageHeading(): Promise<string> {
    const heading = this.page.locator(sel(COMMON_SELECTORS.pageTitle));
    try {
      return (await heading.textContent({ timeout: 5000 })) || '';
    } catch {
      // Fallback to first h1
      const h1 = this.page.locator('h1').first();
      return (await h1.textContent()) || '';
    }
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  /**
   * Assert the page URL contains the expected path.
   */
  async assertUrlContains(expectedPath: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }

  /**
   * Assert the page URL matches exactly.
   */
  async assertUrlEquals(expectedUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  /**
   * Assert the page title contains expected text.
   */
  async assertTitleContains(expectedTitle: string): Promise<void> {
    const title = await this.getTitle();
    expect(title.toLowerCase()).toContain(expectedTitle.toLowerCase());
  }

  // ─── Header Actions (available on all storefront pages) ────────────────────

  /**
   * Search for a product using the header search bar.
   */
  async searchFor(query: string): Promise<void> {
    const searchInput = this.page.locator(sel(HEADER_SELECTORS.searchInput));
    await searchInput.fill(query);
    await this.page.locator(sel(HEADER_SELECTORS.searchButton)).click();
    await this.waitForPageReady();
  }

  /**
   * Navigate to the shopping cart via header icon.
   */
  async goToCart(): Promise<void> {
    await this.page.locator(sel(HEADER_SELECTORS.cartLink)).click();
    await this.waitForPageReady();
  }

  /**
   * Navigate to login page via header link.
   */
  async goToLogin(): Promise<void> {
    await this.page.locator(sel(HEADER_SELECTORS.loginLink)).click();
    await this.waitForPageReady();
  }

  /**
   * Navigate to register page via header link.
   */
  async goToRegister(): Promise<void> {
    await this.page.locator(sel(HEADER_SELECTORS.registerLink)).click();
    await this.waitForPageReady();
  }

  /**
   * Check if the user is currently logged in.
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const accountTrigger = this.page.locator(sel(HEADER_SELECTORS.accountTrigger));
      return await accountTrigger.isVisible({ timeout: 3000 });
    } catch {
      return false;
    }
  }

  /**
   * Logout from the current session.
   */
  async logout(): Promise<void> {
    try {
      const logoutLink = this.page.locator(sel(HEADER_SELECTORS.logoutLink));
      if (await logoutLink.isVisible({ timeout: 3000 })) {
        await logoutLink.click();
        await this.waitForPageReady();
      }
    } catch {
      // May not be logged in — continue
    }
  }

  // ─── Notification Helpers ──────────────────────────────────────────────────

  /**
   * Check if a success bar notification is visible.
   */
  async hasSuccessNotification(): Promise<boolean> {
    try {
      return await this.page
        .locator(sel(COMMON_SELECTORS.barNotificationSuccess))
        .isVisible({ timeout: 3000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if an error bar notification is visible.
   */
  async hasErrorNotification(): Promise<boolean> {
    try {
      return await this.page
        .locator(sel(COMMON_SELECTORS.barNotificationError))
        .isVisible({ timeout: 3000 });
    } catch {
      return false;
    }
  }

  // ─── Screenshot ────────────────────────────────────────────────────────────

  /**
   * Take a screenshot with a descriptive name.
   */
  async takeScreenshot(name: string, fullPage = false): Promise<Buffer> {
    return await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage,
    });
  }
}
