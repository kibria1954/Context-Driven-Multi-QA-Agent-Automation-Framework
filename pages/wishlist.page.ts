/**
 * WishlistPage — Page Object for Wishlist Management.
 * Inherits from BasePage.
 *
 * 100% Centralized Selectors — strictly consumes WISHLIST_SELECTORS from utils/selectors.ts
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { WISHLIST_SELECTORS, sel } from '../utils/selectors';
import { getBarNotificationText, waitForAjaxComplete } from '../utils/helpers';

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
  get headerCountBadge() {
    return this.page.locator(sel(WISHLIST_SELECTORS.wishlistHeaderCountBadge));
  }

  // ─── Page Actions ──────────────────────────────────────────────────────────

  async navigateToWishlistViaHeader(): Promise<void> {
    await this.dismissModals();
    await expect(this.headerWishlistLink).toBeVisible({ timeout: 10000 });
    await this.headerWishlistLink.click();
    await this.waitForPageReady();
    await this.dismissModals();
  }

  async navigateToWishlistViaSidebar(): Promise<void> {
    await this.page.goto('/customer/info');
    await this.dismissModals();
    await expect(this.sidebarWishlistLink).toBeVisible({ timeout: 10000 });
    await this.sidebarWishlistLink.click();
    await this.waitForPageReady();
    await this.dismissModals();
  }

  /**
   * Adds a specific, known product to the wishlist from its product detail page.
   * Defaults to the reference product confirmed in testdata/wishlist-management/seed.json
   * (productId 63, "/cream") rather than an arbitrary "first product on the homepage" —
   * deterministic test data beats picking whatever happens to render first.
   */
  async addProductToWishlistFromPDP(productSlug = '/cream'): Promise<void> {
    await this.page.goto(productSlug);
    await this.waitForPageReady();
    await this.dismissModals();

    await expect(this.pdpWishlistButton).toBeVisible({ timeout: 10000 });
    // Re-dismiss immediately before clicking: #multi-popup-overlay auto-opens on a
    // ~2s delay timer (data-auto-open="true"), so it can silently reappear between
    // the dismiss above and this click. With {force:true}, a reappeared overlay would
    // absorb the click without Playwright ever raising an error — this was the root
    // cause of TC-009 landing 14-19/21 adds instead of 21 with no thrown exception.
    // Waiting for the real network response (not just "click didn't throw") makes a
    // silently-swallowed click fail loudly instead of under-counting later.
    await this.dismissModals();
    const [response] = await Promise.all([
      this.page.waitForResponse((res) => res.url().includes('/addproducttocart/details/') && res.request().method() === 'POST', { timeout: 15000 }),
      this.pdpWishlistButton.click({ force: true }),
    ]);
    expect(response.status(), 'add-to-wishlist AJAX call did not return 200 — click may have been absorbed by an overlay').toBe(200);
    await waitForAjaxComplete(this.page);
  }

  /**
   * Adds a specific, known product to the wishlist from its card on a listing/search page.
   */
  async addProductToWishlistFromGridCard(searchTerm = 'cream', productSlug = '/cream'): Promise<void> {
    await this.page.goto(`/search?q=${searchTerm}`);
    await this.waitForPageReady();
    await this.dismissModals();

    const card = this.page.locator(`.product-item:has(a[href="${productSlug}"])`);
    const cardWishBtn = card.locator(sel(WISHLIST_SELECTORS.productCardWishlistButton));
    await expect(cardWishBtn).toBeVisible({ timeout: 10000 });
    await this.dismissModals();
    const [response] = await Promise.all([
      // NOTE: grid/search-result cards call a DIFFERENT AJAX endpoint than the PDP button
      // (`/addproducttocart/catalog/{id}/2/1` vs. the PDP's `/addproducttocart/details/{id}/2`
      // — confirmed by reading the card's actual onclick attribute live). Match both.
      this.page.waitForResponse((res) => res.url().includes('/addproducttocart/') && res.request().method() === 'POST', { timeout: 15000 }),
      cardWishBtn.click({ force: true }),
    ]);
    expect(response.status(), 'add-to-wishlist AJAX call did not return 200 — click may have been absorbed by an overlay').toBe(200);
    await waitForAjaxComplete(this.page);
  }

  /**
   * Teardown helper — not a user action under test, so it tolerates a bounded
   * retry loop rather than hard-asserting on each click. The iteration cap
   * guards against a genuine infinite loop if a remove button is present but
   * never becomes clickable.
   *
   * Re-dismisses modals on every iteration, not just once up front: the
   * #multi-popup-overlay auto-opens on a ~2s delay timer (data-auto-open="true")
   * and can silently reappear mid-loop, absorbing a force:true click without
   * Playwright ever raising an error. Left unhandled, this made cleanup stop
   * removing items partway through and leave stray items in the *shared*
   * tests/.auth/customer.json account for the next test to inherit — the
   * confirmed root cause of TC-006 seeing 5 items instead of 2. The final
   * assertion turns a still-silent failure into a loud one instead of trusting
   * the loop counter, which never advances once a click is being absorbed.
   */
  async removeAllItemsFromWishlist(): Promise<void> {
    await this.navigate();
    await this.waitForPageReady();
    await this.dismissModals();

    let count = await this.removeItemButtons.count().catch(() => 0);
    console.log(`\n📋 Removing ${count} item(s) from wishlist...`);

    const maxAttempts = count + 10;
    for (let attempt = 0; attempt < maxAttempts && count > 0; attempt++) {
      await this.dismissModals();
      await this.removeItemButtons.first().click({ force: true });
      await waitForAjaxComplete(this.page);
      count = await this.removeItemButtons.count().catch(() => 0);
    }

    await expect(
      this.removeItemButtons,
      'wishlist cleanup did not converge to empty — a remove click was likely absorbed by a reappearing overlay'
    ).toHaveCount(0, { timeout: 10000 });
  }

  /**
   * The wishlist grid uses infinite-scroll pagination: it initially renders only
   * 20 items and marks `.wishlist-has-more[data-has-more="true"]` when more exist,
   * loading the rest only once the page is scrolled to the bottom (confirmed live,
   * 2026-08-21 — a 21-item wishlist showed exactly 20 article.wishlist-item cards
   * until scrolled). Call this before asserting a total count above 20.
   *
   * Re-dismisses modals before every scroll (same overlay-reappearance risk as
   * removeAllItemsFromWishlist — a reappeared popup can intercept the
   * scroll-triggered lazy-load) and stops as soon as the rendered count stops
   * growing rather than trusting `data-has-more` alone, so a stalled load fails
   * fast instead of silently under-loading (the confirmed root cause of TC-009's
   * non-deterministic 17/21 then 13/21 undercounts).
   */
  async loadAllWishlistItems(): Promise<void> {
    const hasMore = this.page.locator('.wishlist-has-more');
    let previousCount = await this.wishlistItemCards.count().catch(() => 0);
    for (let attempt = 0; attempt < 10; attempt++) {
      const stillHasMore = (await hasMore.getAttribute('data-has-more').catch(() => 'false')) === 'true';
      if (!stillHasMore) break;
      await this.dismissModals();
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await waitForAjaxComplete(this.page);

      const currentCount = await this.wishlistItemCards.count().catch(() => 0);
      if (currentCount === previousCount) break;
      previousCount = currentCount;
    }
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  async assertWishlistLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/korean-wishlist|\/wishlist/, { timeout: 10000 });
  }

  async assertItemsDisplayed(expectedCount?: number): Promise<void> {
    await this.assertWishlistLoaded();
    await expect(this.wishlistItemCards.first()).toBeVisible({ timeout: 10000 });
    if (expectedCount !== undefined) {
      await expect(this.wishlistItemCards).toHaveCount(expectedCount, { timeout: 10000 });
    }
  }

  async assertEmptyWishlistState(): Promise<void> {
    await this.assertWishlistLoaded();
    await expect(this.emptyWishlistMessage).toBeVisible({ timeout: 10000 });
    await expect(this.emptyWishlistMessage).toHaveText('Your wishlist is empty.');
  }

  async assertBrowseProductsButtonNavigates(): Promise<void> {
    await this.dismissModals();
    await expect(this.browseProductsButton).toBeVisible({ timeout: 10000 });
    await this.browseProductsButton.click({ force: true });
    await this.waitForPageReady();
    await expect(this.page).toHaveURL(/\/$/);
  }

  async getNotificationText(): Promise<string> {
    return await getBarNotificationText(this.page);
  }

  /** Parses the header badge text (e.g. "(3)") into a number. */
  async getHeaderWishlistCount(): Promise<number> {
    const text = (await this.headerCountBadge.textContent()) || '';
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async assertHeaderWishlistCount(expected: number): Promise<void> {
    await expect(this.headerCountBadge).toHaveText(new RegExp(`\\(${expected}\\)`), { timeout: 10000 });
  }
}
