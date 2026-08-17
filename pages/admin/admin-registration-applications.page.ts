/**
 * AdminRegistrationApplicationsPage — Page Object for Admin > Advanced B2B/B2C > Registration Applications.
 *
 * Confirmed real location for REQ-07 (the requirement's original "KD Registration Details"
 * wording described a section on the customer's own profile page — live verification found
 * no such section there; this dedicated grid is the owner-confirmed real location).
 * See workflows/b2b-registration.verify.json's discrepancy note on the Admin Customer Edit page.
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { ERP_REGISTRATION_SELECTORS, sel } from '../../utils/selectors';

export class AdminRegistrationApplicationsPage extends BasePage {
  get path(): string {
    return '/Admin/ErpRegistrationApplication/List';
  }

  // ─── Locators ──────────────────────────────────────────────────────────────

  get applicationsGrid() {
    return this.page.locator(sel(ERP_REGISTRATION_SELECTORS.applicationsGrid));
  }

  get gridSearchInput() {
    return this.page.locator(sel(ERP_REGISTRATION_SELECTORS.gridSearchInput));
  }

  get pageHeading() {
    return this.page.locator('.content-header h1, h1.float-left, .content-header').first();
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

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
    const row = this.findApplicationRow(identifier);
    const count = await row.count().catch(() => 0);
    expect(count).toBe(0);
    // Grid container itself must still render (no crash/500).
    const bodyText = (await this.page.locator('body').textContent()) || '';
    expect(bodyText.toLowerCase()).not.toContain('server error');
  }
}
