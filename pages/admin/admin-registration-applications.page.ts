/**
 * AdminRegistrationApplicationsPage — Page Object for Admin > Advanced B2B/B2C > ERP Accounts.
 *
 * Confirmed real location for REQ-07 (the requirement's original "KD Registration Details"
 * wording described a section on the customer's own profile page — live verification found
 * no such section there). An earlier pass had pointed this at
 * /Admin/ErpRegistrationApplication/List ("Registration Applications") based on the page
 * existing with plausible column headers — but that page never actually receives a row from
 * self-registration (confirmed live: "No records", matching the original Stage-4 exploration
 * screenshot too — it was never actually verified end-to-end). /Admin/ErpAccount/List
 * ("ERP Accounts") is the grid that genuinely populates per submitted registration.
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { ERP_REGISTRATION_SELECTORS, sel } from '../../utils/selectors';

export class AdminRegistrationApplicationsPage extends BasePage {
  get path(): string {
    return '/Admin/ErpAccount/List';
  }

  // ─── Locators ──────────────────────────────────────────────────────────────

  get applicationsGrid() {
    return this.page.locator(sel(ERP_REGISTRATION_SELECTORS.applicationsGrid));
  }

  get gridSearchInput() {
    return this.page.locator(sel(ERP_REGISTRATION_SELECTORS.gridSearchInput));
  }

  get gridSearchButton() {
    return this.page.locator(sel(ERP_REGISTRATION_SELECTORS.gridSearchButton));
  }

  get pageHeading() {
    return this.page.locator('.content-header h1, h1.float-left, .content-header').first();
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  /**
   * Filter the grid by Account Name so the target row is guaranteed on the current
   * page — the grid paginates and can otherwise hide a freshly-created row behind
   * however many prior test runs' accounts sort ahead of it.
   */
  async searchByAccountName(identifier: string): Promise<void> {
    await this.gridSearchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.gridSearchInput.fill(identifier);
    await this.gridSearchButton.click();
    await this.waitForPageReady();
    await this.page.waitForTimeout(1000); // allow grid AJAX reload
  }

  /**
   * Locate the application row for a given company name or contact email.
   * Returns the row locator; caller decides whether to assert visibility or count.
   */
  findApplicationRow(identifier: string) {
    return this.page.locator(`table tbody tr:has-text("${identifier}")`).first();
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  async assertGridDisplayed(): Promise<void> {
    await expect(this.pageHeading).toBeVisible({ timeout: 10000 });
    await expect(this.applicationsGrid.first()).toBeVisible({ timeout: 10000 });
  }

  /**
   * Assert the full submitted wholesale application data is visible for a given applicant,
   * cross-checking Company Info, Contact Details, and Account Setup fields captured at
   * registration (REQ-07) against the grid's ERP-side columns.
   */
  async assertApplicationDataVisible(identifier: string, expectedFields: Record<string, string>): Promise<void> {
    await this.searchByAccountName(identifier);
    const row = this.findApplicationRow(identifier);
    await expect(row).toBeVisible({ timeout: 10000 });
    const rowText = (await row.textContent()) || '';
    for (const value of Object.values(expectedFields)) {
      expect(rowText).toContain(value);
    }
  }

  /**
   * Assert the grid renders without crashing when no application matches (edge case, TC-027).
   */
  async assertNoMatchHandledGracefully(identifier: string): Promise<void> {
    await expect(this.pageHeading).toBeVisible({ timeout: 10000 });
    await this.searchByAccountName(identifier);
    const row = this.findApplicationRow(identifier);
    const count = await row.count().catch(() => 0);
    expect(count).toBe(0);
    // Grid container itself must still render (no crash/500).
    const bodyText = (await this.page.locator('body').textContent()) || '';
    expect(bodyText.toLowerCase()).not.toContain('server error');
  }
}
