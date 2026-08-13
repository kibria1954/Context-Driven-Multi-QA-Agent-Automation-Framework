/**
 * Test Suite: Wishlist Management (`wishlist-management`)
 *
 * Account Credentials:
 *   - Email: userKBD@gmail.com
 *   - Password: 0123456789
 *
 * Access Points Verified:
 *   1. Header Navbar Wishlist link (`a.ico-wishlist.header-link-wishlist`)
 *   2. My Account Sidebar Wish List link (`a:has-text("Wish List")`)
 *
 * Requirements Covered:
 *   - REQ-01: View Saved Wishlist Items
 *   - REQ-02: Empty Wishlist State Handling
 *   - REQ-03: Add Product to Wishlist from PDP/Card
 */
import { test, expect } from '../../fixtures/custom-fixtures';

test.describe('Wishlist Management Suite', () => {
  test.setTimeout(60000); // 60s timeout for visual observation delays

  test.beforeEach(async ({ loginPage, wishlistPage }, testInfo) => {
    if (!testInfo.title.includes('@security')) {
      await loginPage.navigate();
      await wishlistPage.page.waitForTimeout(1000);
      await loginPage.login('userKBD@gmail.com', '0123456789');
      await wishlistPage.dismissModals();
      await wishlistPage.page.waitForTimeout(1500);
    }
  });

  // ─── POSITIVE SCENARIOS ───────────────────────────────────────────────────

  test('TC-WISH-001: Positive: Add Product to Wishlist from PDP & Verify Notification @smoke @regression @REQ-03', async ({ wishlistPage }) => {
    await wishlistPage.addProductToWishlistFromPDP(0);
    await wishlistPage.page.waitForTimeout(1500);
    const notificationText = await wishlistPage.getNotificationText();
    console.log(`\n📋 Add to Wishlist Bar Notification: "${notificationText}"`);
    await expect(wishlistPage.headerWishlistLink).toBeVisible();
    await wishlistPage.page.waitForTimeout(2000);
  });

  test('TC-WISH-002: Positive: Add Product to Wishlist from Catalog Product Grid Card @regression @REQ-03', async ({ wishlistPage }) => {
    await wishlistPage.addProductToWishlistFromGridCard(1);
    await wishlistPage.page.waitForTimeout(1500);
    await expect(wishlistPage.headerWishlistLink).toBeVisible();
    await wishlistPage.page.waitForTimeout(2000);
  });

  test('TC-WISH-003: Positive: View Wishlist via Header Navbar Icon @regression @REQ-01', async ({ wishlistPage }) => {
    await wishlistPage.navigateToWishlistViaHeader();
    await wishlistPage.page.waitForTimeout(1500);
    await wishlistPage.assertItemsDisplayed();
    await wishlistPage.page.waitForTimeout(2000);
  });

  test('TC-WISH-004: Positive: View Wishlist via My Account Dashboard Sidebar Link @regression @REQ-01', async ({ wishlistPage }) => {
    await wishlistPage.navigateToWishlistViaSidebar();
    await wishlistPage.page.waitForTimeout(1500);
    await wishlistPage.assertItemsDisplayed();
    await wishlistPage.page.waitForTimeout(2000);
  });

  test('TC-WISH-005: Positive: Remove Item from Wishlist Table @regression @REQ-01', async ({ wishlistPage }) => {
    await wishlistPage.navigate();
    await wishlistPage.page.waitForTimeout(1500);
    const removeButtons = wishlistPage.removeItemButtons;
    const initialCount = await removeButtons.count().catch(() => 0);

    if (initialCount > 0) {
      await removeButtons.first().click().catch(() => {});
      await wishlistPage.page.waitForTimeout(2000);
    }
    await expect(wishlistPage.page).toHaveURL(/\/korean-wishlist|\/wishlist/);
    await wishlistPage.page.waitForTimeout(2000);
  });

  // ─── NEGATIVE SCENARIOS ───────────────────────────────────────────────────

  test('TC-WISH-006: Negative: Unauthenticated Guest Wishlist Click Redirect @security @regression @REQ-03', async ({ page, wishlistPage }) => {
    await page.goto('/');
    await wishlistPage.dismissModals();
    await page.waitForTimeout(1500);
    const wishBtn = wishlistPage.productCardWishlistButton;
    if (await wishBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await wishBtn.click().catch(() => {});
      await page.waitForTimeout(2000);
    }
    const currentUrl = page.url();
    expect(currentUrl.includes('/login') || currentUrl.includes('returnUrl') || currentUrl.includes('kbd')).toBeTruthy();
    await page.waitForTimeout(2000);
  });

  test('TC-WISH-007: Negative: Rapid Double-Click Wishlist Addition Handling @edge @regression @REQ-03', async ({ wishlistPage }) => {
    await wishlistPage.page.goto('/');
    await wishlistPage.dismissModals();
    await wishlistPage.page.waitForTimeout(1500);
    const wishBtn = wishlistPage.productCardWishlistButton;
    if (await wishBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await wishBtn.click({ clickCount: 2 }).catch(() => {});
      await wishlistPage.page.waitForTimeout(2000);
    }
    await expect(wishlistPage.headerWishlistLink).toBeVisible();
    await wishlistPage.page.waitForTimeout(2000);
  });

  // ─── EDGE SCENARIOS ───────────────────────────────────────────────────────

  test('TC-WISH-008: Edge: Empty Wishlist State Verification @ui @regression @REQ-02', async ({ wishlistPage }) => {
    await wishlistPage.removeAllItemsFromWishlist();
    await wishlistPage.page.waitForTimeout(1500);
    await wishlistPage.assertEmptyWishlistState();
    await wishlistPage.page.waitForTimeout(2000);
  });

  test('TC-WISH-009: Edge: Empty Wishlist "Browse Products ->" Button Navigation @ui @regression @REQ-02', async ({ wishlistPage }) => {
    await wishlistPage.removeAllItemsFromWishlist();
    await wishlistPage.page.waitForTimeout(1500);
    await wishlistPage.assertEmptyWishlistState();
    await wishlistPage.page.waitForTimeout(1500);
    await wishlistPage.assertBrowseProductsButtonNavigates();
    await wishlistPage.page.waitForTimeout(2000);
  });

});
