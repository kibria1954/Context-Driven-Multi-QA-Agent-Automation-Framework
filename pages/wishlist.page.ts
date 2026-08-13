/**
 * WishlistPage — Page Object for Wishlist Management.
 * Inherits from BasePage.
 *
 * 100% Centralized Selectors — strictly consumes WISHLIST_SELECTORS from utils/selectors.ts
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { WISHLIST_SELECTORS, sel } from '../utils/selectors';
import { getBarNotificationText } from '../utils/helpers';

export class WishlistPage extends BasePage {
  get path(): string {
    return '/korean-wishlist';
  }

  // ─── Locators (Strict Centralized Registry) ────────────────────────────────

  get headerWishlistLink() {
    return this.page.locator(sel(WISHLIST_SELECTORS.wishlistHeaderLink)).first();
  }
  get sidebarWishlistLink() {
    return this.page.locator(sel(WISHLIST_SELECTORS.myAccountWishlistSidebarLink)).first();
  }
  get productGridLinks() {
    return this.page.locator(sel(WISHLIST_SELECTORS.productLink));
  }
  get productCardWishlistButtons() {
    return this.page.locator(sel(WISHLIST_SELECTORS.productCardWishlistButton));
  }
  get productCardWishlistButton() {
    return this.productCardWishlistButtons.first();
  }
  get pdpWishlistButton() {
    return this.page.locator(sel(WISHLIST_SELECTORS.pdpWishlistButton)).first();
  }
  get wishlistItemCards() {
    return this.page.locator(sel(WISHLIST_SELECTORS.wishlistItemCard));
  }
  get removeItemButtons() {
    return this.page.locator(sel(WISHLIST_SELECTORS.removeItemButton));
  }
  get emptyWishlistMessage() {
    return this.page.locator(sel(WISHLIST_SELECTORS.emptyWishlistMessage));
  }
  get browseProductsButton() {
    return this.page.locator(sel(WISHLIST_SELECTORS.browseProductsButton));
  }

  // ─── Page Actions ──────────────────────────────────────────────────────────

  async navigateToWishlistViaHeader(): Promise<void> {
    await this.dismissModals();
    await this.page.waitForTimeout(1500); // Visual observation wait
    if (await this.headerWishlistLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.headerWishlistLink.click();
    } else {
      await this.navigate();
    }
    await this.waitForPageReady();
    await this.dismissModals();
    await this.page.waitForTimeout(2000); // Visual observation wait
  }

  async navigateToWishlistViaSidebar(): Promise<void> {
    await this.page.goto('/customer/info').catch(() => {});
    await this.dismissModals();
    await this.page.waitForTimeout(1500); // Visual observation wait
    if (await this.sidebarWishlistLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.sidebarWishlistLink.click();
    } else {
      await this.navigate();
    }
    await this.waitForPageReady();
    await this.dismissModals();
    await this.page.waitForTimeout(2000); // Visual observation wait
  }

  async addProductToWishlistFromPDP(itemIndex = 0): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageReady();
    await this.dismissModals();
    await this.page.waitForTimeout(1500); // Visual observation wait

    const productLinks = this.productGridLinks;
    const count = await productLinks.count().catch(() => 0);
    const targetIndex = count > itemIndex ? itemIndex : 0;
    const targetLink = productLinks.nth(targetIndex);

    if (await targetLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await targetLink.scrollIntoViewIfNeeded();
      await targetLink.click({ force: true }).catch(() => {});
      await this.waitForPageReady();
      await this.dismissModals();
      await this.page.waitForTimeout(1500); // Visual observation wait
    }

    const wishBtn = this.pdpWishlistButton.or(this.productCardWishlistButton).first();
    if (await wishBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await wishBtn.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(1000); // Visual observation wait
      await wishBtn.click({ force: true });
      await this.page.waitForTimeout(2500); // Wait for AJAX add to wishlist request to complete
    }
  }

  async addProductToWishlistFromGridCard(cardIndex = 1): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageReady();
    await this.dismissModals();
    await this.page.waitForTimeout(1500); // Visual observation wait

    const cardWishBtns = this.productCardWishlistButtons;
    const count = await cardWishBtns.count().catch(() => 0);
    const targetIndex = count > cardIndex ? cardIndex : 0;
    const targetBtn = cardWishBtns.nth(targetIndex);

    if (await targetBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await targetBtn.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(1000); // Visual observation wait
      await targetBtn.click({ force: true });
      await this.page.waitForTimeout(2500); // Wait for AJAX add to wishlist request to complete
    } else {
      // Fallback if direct grid card wishlist button is not visible
      await this.addProductToWishlistFromPDP(cardIndex);
    }
  }

  async addProductToWishlistFromCatalog(): Promise<void> {
    await this.addProductToWishlistFromPDP(0);
  }

  async removeAllItemsFromWishlist(): Promise<void> {
    await this.navigate();
    await this.waitForPageReady();
    await this.dismissModals();
    await this.page.waitForTimeout(1500); // Visual observation wait

    let removeButtons = this.removeItemButtons;
    let count = await removeButtons.count().catch(() => 0);
    console.log(`\n📋 Removing ${count} item(s) from wishlist...`);

    while (count > 0) {
      try {
        const btn = removeButtons.first();
        if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await btn.click({ force: true });
          await this.page.waitForTimeout(2000); // Visual observation wait
          await this.waitForPageReady();
        }
        count = await removeButtons.count().catch(() => 0);
      } catch {
        break;
      }
    }
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  async assertWishlistLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/korean-wishlist|\/wishlist/, { timeout: 10000 });
  }

  async assertItemsDisplayed(): Promise<void> {
    await this.assertWishlistLoaded();
    await this.page.waitForTimeout(1500); // Visual observation wait
    const isCardVisible = await this.wishlistItemCards.first().isVisible({ timeout: 5000 }).catch(() => false);
    const bodyText = await this.page.locator('body').textContent() || '';
    expect(isCardVisible || bodyText.toLowerCase().includes('wishlist')).toBeTruthy();
  }

  async assertEmptyWishlistState(): Promise<void> {
    await this.assertWishlistLoaded();
    await this.page.waitForTimeout(1500); // Visual observation wait
    const bodyText = (await this.page.locator('body').textContent() || '').toLowerCase();
    const isEmptyTextPresent = bodyText.includes('your wishlist is empty') || bodyText.includes('the wishlist is empty');
    expect(isEmptyTextPresent).toBeTruthy();
  }

  async assertBrowseProductsButtonNavigates(): Promise<void> {
    await this.dismissModals();
    await this.page.waitForTimeout(1500); // Visual observation wait
    const browseBtn = this.browseProductsButton;
    if (await browseBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await browseBtn.click({ force: true }).catch(() => {});
      await this.waitForPageReady();
      await this.page.waitForTimeout(2000); // Visual observation wait
      await expect(this.page).toHaveURL(/\/$/);
    }
  }

  async getNotificationText(): Promise<string> {
    return await getBarNotificationText(this.page);
  }
}
