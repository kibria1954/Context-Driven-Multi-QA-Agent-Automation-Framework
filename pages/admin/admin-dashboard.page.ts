/**
 * AdminDashboardPage — Page Object for the NopCommerce admin dashboard.
 * Handles sidebar navigation, dashboard elements, and common admin actions.
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { ADMIN_SELECTORS, sel } from '../../utils/selectors';

export class AdminDashboardPage extends BasePage {
  get path(): string {
    return '/Admin';
  }

  // ─── Locators ──────────────────────────────────────────────────────────────

  get dashboardHeader() { return this.page.locator(sel(ADMIN_SELECTORS.dashboardHeader)); }
  get sidebarMenu() { return this.page.locator(sel(ADMIN_SELECTORS.sidebarMenu)); }

  // ─── Actions ───────────────────────────────────────────────────────────────

  /**
   * Navigate to a specific admin section via sidebar menu.
   * Handles expandable menu items.
   */
  async navigateToSection(menuText: string, submenuText?: string): Promise<void> {
    // Click the main menu item
    const menuItem = this.page.locator(`.sidebar-menu .nav-link:has-text("${menuText}")`).first();
    await menuItem.click();

    if (submenuText) {
      // Wait for submenu to expand
      await this.page.waitForTimeout(500);
      const submenuItem = this.page.locator(`.sidebar-menu .nav-link:has-text("${submenuText}")`).first();
      await submenuItem.click();
    }

    await this.waitForPageReady();
  }

  /**
   * Navigate to Customer List page.
   */
  async goToCustomerList(): Promise<void> {
    await this.navigateToSection('Customers', 'Customers');
  }

  /**
   * Navigate to Product List page.
   */
  async goToProductList(): Promise<void> {
    await this.navigateToSection('Catalog', 'Products');
  }

  /**
   * Navigate to Order List page.
   */
  async goToOrderList(): Promise<void> {
    await this.navigateToSection('Sales', 'Orders');
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  /**
   * Assert the admin dashboard is displayed.
   */
  async assertDashboardDisplayed(): Promise<void> {
    await expect(this.dashboardHeader).toBeVisible({ timeout: 10000 });
    await expect(this.sidebarMenu).toBeVisible();
  }

  /**
   * Assert we are on the admin panel (URL contains /Admin).
   */
  async assertOnAdminPanel(): Promise<void> {
    await expect(this.page).toHaveURL(/\/Admin/i);
  }
}
