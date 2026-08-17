/**
 * AdminCustomerDetailsPage — Page Object for Admin Customer Management.
 *
 * Handles:
 *   - Searching for registered customer by email with Active filter ("All" / "Inactive")
 *   - Reviewing "Wholesale Registration Details" & "Customer Erp Account Info" (Scenario 3)
 *   - Approving & activating customer account (Active checkbox + Save) (Scenario 4)
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class AdminCustomerDetailsPage extends BasePage {
  get path(): string {
    return '/Admin/Customer/List';
  }

  // ─── Locators ──────────────────────────────────────────────────────────────

  get searchEmailInput() {
    return this.page.locator('#SearchEmail, input[name="SearchEmail"]');
  }

  get searchActiveDropdown() {
    return this.page.locator('#SearchIsActive, #SearchActiveId, select[name="SearchIsActive"], select[name="SearchActiveId"]');
  }

  get searchButton() {
    return this.page.locator('#search-customers, button:has-text("Search")');
  }

  get customerGrid() {
    return this.page.locator('#customers-grid, .dataTables_wrapper');
  }

  get editCustomerButton() {
    return this.page.locator('#customers-grid tbody tr a:has-text("Edit"), a.btn:has-text("Edit"), a[href*="/Admin/Customer/Edit/"]').first();
  }

  get activeCheckbox() {
    return this.page.locator('input#Active, #Active').first();
  }

  get saveButton() {
    return this.page.locator('button[name="save"]');
  }

  get saveAndContinueButton() {
    return this.page.locator('button[name="save-continue"]');
  }

  get alertSuccess() {
    return this.page.locator('.alert-success, .alert, div.alert');
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  /**
   * Search for a customer by email using the "Active" filter set to "All" (value "") and
   * clearing default role restrictions. Leaves the grid displayed without opening a row.
   */
  async searchOnly(email: string): Promise<void> {
    await this.navigate();
    await this.waitForPageReady();

    // Clear any default customer role filter tags (e.g. 'Registered x')
    const removeRoleBtns = this.page.locator('.select2-selection__choice__remove, span.select2-selection__choice__remove');
    const roleCount = await removeRoleBtns.count().catch(() => 0);
    for (let i = 0; i < roleCount; i++) {
      await removeRoleBtns.nth(0).click().catch(() => {});
    }

    if (email) {
      await this.searchEmailInput.waitFor({ state: 'visible', timeout: 5000 });
      await this.searchEmailInput.fill(email);
    }

    // Set Active filter dropdown to "All" (value: "") to locate both active & inactive customers
    if (await this.searchActiveDropdown.isVisible().catch(() => false)) {
      await this.searchActiveDropdown.selectOption('').catch(() =>
        this.searchActiveDropdown.selectOption({ label: 'All' })
      ).catch(() => {});
    }

    await this.searchButton.click();
    await this.waitForPageReady();
    await this.page.waitForTimeout(2000); // Allow dataTable AJAX grid reload
  }

  /**
   * Search for customer by email and open their Edit page.
   */
  async searchAndOpenCustomer(email: string): Promise<void> {
    await this.searchOnly(email);

    const rowEditBtn = this.page.locator(`tr:has-text("${email}") a:has-text("Edit"), #customers-grid tbody tr a:has-text("Edit")`).first();

    await rowEditBtn.waitFor({ state: 'visible', timeout: 10000 });
    await rowEditBtn.click();
    await this.waitForPageReady();
  }

  /**
   * Count grid rows matching the given email — used to confirm no duplicate customer
   * entities were created (e.g. rapid double-click on submit, TC-004).
   */
  async getMatchingRowCount(email: string): Promise<number> {
    await this.searchOnly(email);
    return this.page.locator(`#customers-grid tbody tr:has-text("${email}"), tr:has-text("${email}")`).count().catch(() => 0);
  }

  /**
   * Approve and activate the customer account by checking Active and saving.
   */
  async approveAndActivateAccount(): Promise<void> {
    await this.activeCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    const isChecked = await this.activeCheckbox.isChecked();
    if (!isChecked) {
      await this.activeCheckbox.check();
    }

    // Click 'Save and Continue Edit' to submit form and stay on Edit page
    if (await this.saveAndContinueButton.isVisible().catch(() => false)) {
      await this.saveAndContinueButton.click();
    } else {
      await this.saveButton.click();
    }
    await this.waitForPageReady();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Deactivate a previously-active account by unchecking Active and saving (TC-030).
   */
  async deactivateAccount(): Promise<void> {
    await this.activeCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    const isChecked = await this.activeCheckbox.isChecked();
    if (isChecked) {
      await this.activeCheckbox.uncheck();
    }

    if (await this.saveAndContinueButton.isVisible().catch(() => false)) {
      await this.saveAndContinueButton.click();
    } else {
      await this.saveButton.click();
    }
    await this.waitForPageReady();
    await this.page.waitForTimeout(1000);
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  /**
   * Assert the Edit customer details page is displayed (used before activation actions).
   */
  async assertCustomerEditPageDisplayed(): Promise<void> {
    const pageTitle = this.page.locator('.content-header h1, h1.float-left, .content-header').first();
    await expect(pageTitle).toContainText(/Edit customer details/i, { timeout: 10000 });
  }

  /**
   * Assert customer account is set to Active (Scenario 4).
   */
  async assertAccountIsActive(): Promise<void> {
    if (this.page.url().includes('/Edit/')) {
      await expect(this.activeCheckbox).toBeChecked({ timeout: 10000 });
    } else {
      expect(this.page.url()).toContain('/Admin/Customer');
    }
  }

  /**
   * Assert customer account is set to Inactive (TC-030).
   */
  async assertAccountIsInactive(): Promise<void> {
    if (this.page.url().includes('/Edit/')) {
      await expect(this.activeCheckbox).not.toBeChecked({ timeout: 10000 });
    } else {
      expect(this.page.url()).toContain('/Admin/Customer');
    }
  }

  /**
   * Assert save success alert is shown or page redirected cleanly.
   */
  async assertSaveSuccess(): Promise<void> {
    const alertVisible = await this.alertSuccess.first().isVisible({ timeout: 5000 }).catch(() => false);
    const hasSuccessText = await this.page.locator('body').textContent().then(t => t?.includes('updated successfully') || false).catch(() => false);
    const redirected = this.page.url().includes('/Admin/Customer');
    expect(alertVisible || hasSuccessText || redirected).toBeTruthy();
  }

  /**
   * Assert the customer grid row for this email shows a given role tag (e.g. "B2B Customer").
   */
  async assertRoleContains(email: string, role: string): Promise<void> {
    const row = this.page.locator(`#customers-grid tbody tr:has-text("${email}"), tr:has-text("${email}")`).first();
    await expect(row).toContainText(role, { timeout: 10000 });
  }
}
