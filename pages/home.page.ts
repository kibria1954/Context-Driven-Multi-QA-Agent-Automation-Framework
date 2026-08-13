/**
 * HomePage — Page Object for the KBD NopCommerce storefront homepage.
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { HOME_SELECTORS, NAV_SELECTORS, sel } from '../utils/selectors';

export class HomePage extends BasePage {
  get path(): string {
    return '/';
  }

  // ─── Locators ──────────────────────────────────────────────────────────────

  get heroSlider() { return this.page.locator(sel(HOME_SELECTORS.heroSlider)); }
  get featuredProducts() { return this.page.locator(sel(HOME_SELECTORS.featuredProducts)); }
  get productCards() { return this.page.locator(sel(HOME_SELECTORS.productCard)); }

  // ─── Actions ───────────────────────────────────────────────────────────────

  /**
   * Click on a product card by its title text.
   */
  async clickProduct(productName: string): Promise<void> {
    await this.page
      .locator(sel(HOME_SELECTORS.productTitle))
      .filter({ hasText: productName })
      .first()
      .click();
    await this.waitForPageReady();
  }

  /**
   * Add a product to cart from the homepage grid by clicking its add-to-cart button.
   */
  async addProductToCartByIndex(index: number): Promise<void> {
    await this.page.locator(sel(HOME_SELECTORS.addToCartButton)).nth(index).click();
    await this.waitForPageReady();
  }

  /**
   * Navigate to a specific category via the header menu.
   */
  async navigateToCategory(categoryName: string): Promise<void> {
    await this.page.locator(sel(NAV_SELECTORS.categoriesMenu)).click();
    await this.page.locator(`.sublist a:has-text("${categoryName}")`).click();
    await this.waitForPageReady();
  }

  /**
   * Navigate to the Brands page.
   */
  async navigateToBrands(): Promise<void> {
    await this.page.locator(sel(NAV_SELECTORS.brandLink)).click();
    await this.waitForPageReady();
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  /**
   * Assert the homepage is fully loaded with key elements visible.
   */
  async assertHomepageLoaded(): Promise<void> {
    await expect(this.featuredProducts).toBeVisible({ timeout: 10000 });
  }

  /**
   * Assert a minimum number of products are displayed.
   */
  async assertMinimumProducts(count: number): Promise<void> {
    const productCount = await this.productCards.count();
    expect(productCount).toBeGreaterThanOrEqual(count);
  }

  /**
   * Get the count of visible product cards.
   */
  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  /**
   * Get all visible product titles.
   */
  async getProductTitles(): Promise<string[]> {
    return await this.page.locator(sel(HOME_SELECTORS.productTitle)).allTextContents();
  }
}
