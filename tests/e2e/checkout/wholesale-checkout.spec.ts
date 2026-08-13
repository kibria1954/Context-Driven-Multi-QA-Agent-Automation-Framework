/**
 * Test Suite: Wholesale Direct Checkout & Credit Limit Bypass (`wholesale-checkout`)
 *
 * Account Credentials:
 *   - Email: userKBD@gmail.com
 *   - Password: 0123456789
 *
 * Requirements Covered:
 *   - REQ-01: Direct Order Confirmation Flow (Skip Payment & Address)
 *   - REQ-02: Default Registration Address Used as Shipping Address
 *   - REQ-03: Order Placed Regardless of Credit Limit (ERP Sync)
 *
 * Strictly adheres to 5 Quality Gates & User Directives:
 *   - Nested test flow for TC 1, 2, 3, 4 & 8 (similar end-to-end checkout flow)
 *   - Deletes items ONE BY ONE from cart before checkout
 *   - Validates generated Order ID in Order History (/order/history) table for TC 8
 *   - TC 5 validates subtotal below ৳10,000 blocks checkout without placing order
 *   - TC 9 validates checkout trigger without placing order
 *   - Dynamic PDP stock validation and dynamic quantity (10–15)
 */
import { test, expect } from '../../fixtures/custom-fixtures';

test.describe('Wholesale Checkout Suite', () => {

  test.beforeEach(async ({ loginPage, checkoutPage }) => {
    test.setTimeout(120000); // 120s timeout per test for visual observation & checkout steps
    await loginPage.navigate();
    await checkoutPage.page.waitForTimeout(1000);
    await loginPage.login('userKBD@gmail.com', '0123456789');
    await checkoutPage.dismissModals();
    await checkoutPage.page.waitForTimeout(2000);
  });

  // ─── NESTED SCENARIO: TC 1, 2, 3, 4 & 8 UNIFIED END-TO-END FLOW ──────────

  test('TC-CHK-001-004-008: Nested E2E Flow: Cart Addition -> Subtotal Threshold -> Direct Checkout -> Credit Limit Bypass -> Address Locking & Order History Validation @smoke @regression @REQ-01 @REQ-02 @REQ-03', async ({ checkoutPage }) => {
    let generatedOrderNumber = '';

    await test.step('TC-CHK-004: Clear cart one by one, add eligible product (qty 10-15), and verify cart subtotal >= ৳10,000', async () => {
      await checkoutPage.clearCart();
      await checkoutPage.addSufficientProductsToCart();
      await checkoutPage.assertMinOrderMetAndCheckoutEnabled();
    });

    await test.step('TC-CHK-001: Proceed to Checkout and verify payment method & shipping address entry are bypassed', async () => {
      await checkoutPage.proceedToCheckout(true);
      await checkoutPage.assertDirectCheckoutBypassesPaymentAndAddress();
    });

    await test.step('TC-CHK-003: Confirm order placement despite exceeded credit limit and extract generated Order Number', async () => {
      await checkoutPage.confirmOrder();
      await checkoutPage.assertOrderCompletedSuccessfully();
      generatedOrderNumber = await checkoutPage.getPlacedOrderNumber();
    });

    await test.step('TC-CHK-002: Verify default registration address was used as shipping address', async () => {
      await checkoutPage.assertDefaultRegistrationAddressUsed();
    });

    await test.step('TC-CHK-008: Navigate to Order History (https://kbd.nop-station.site/order/history) and validate generated Order ID', async () => {
      await checkoutPage.verifyOrderInOrderHistory(generatedOrderNumber);
    });
  });

  // ─── NEGATIVE & SECURITY SCENARIOS ─────────────────────────────────────────

  test('TC-CHK-005: Negative: Subtotal Below ৳10,000 Threshold Blocks Checkout (No Order Placed) @validation @regression @REQ-01', async ({ checkoutPage }) => {
    await checkoutPage.clearCart();
    await checkoutPage.addSmallQuantityToCart(1);
    await checkoutPage.assertMinOrderNotMetAndCheckoutDisabled();
    await checkoutPage.page.waitForTimeout(1500);
  });

  test('TC-CHK-006: Security: Address Locking Verification During Checkout @security @regression @REQ-02', async ({ checkoutPage }) => {
    await checkoutPage.clearCart();
    await checkoutPage.addSufficientProductsToCart();
    await checkoutPage.proceedToCheckout(true);
    await checkoutPage.assertDirectCheckoutBypassesPaymentAndAddress();
    await checkoutPage.page.waitForTimeout(1500);
  });

  test('TC-CHK-007: Security: Unauthenticated Guest Checkout Click Redirect @security @regression @REQ-01', async ({ page, checkoutPage }) => {
    await page.goto('/logout');
    await page.waitForTimeout(1500);
    await page.goto('/onepagecheckout');
    await page.waitForTimeout(1500);

    const currentUrl = page.url().toLowerCase();
    expect(currentUrl.includes('/login') || currentUrl.includes('returnurl') || currentUrl.includes('/cart')).toBeTruthy();
    await page.waitForTimeout(1500);
  });

  // ─── EDGE & UI SCENARIOS ─────────────────────────────────────────────────

  test('TC-CHK-009: Edge: Rapid Double-Click Checkout Handling (Without Order Placement) @edge @regression @REQ-01', async ({ checkoutPage }) => {
    await checkoutPage.clearCart();
    await checkoutPage.addSufficientProductsToCart();
    await checkoutPage.navigate();
    await checkoutPage.dismissModals();

    const termsBox = checkoutPage.termsOfServiceCheckbox;
    if (await termsBox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await termsBox.check({ force: true }).catch(() => {});
      await checkoutPage.page.evaluate(() => {
        const cb = document.querySelector('#termsofservice') as HTMLInputElement;
        if (cb) {
          cb.checked = true;
          cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    const checkoutBtn = checkoutPage.proceedToCheckoutButton;
    await expect(checkoutBtn).toBeVisible({ timeout: 10000 });
    await checkoutBtn.click({ clickCount: 2, force: true }).catch(() => {});
    await checkoutPage.page.waitForTimeout(3000);

    await checkoutPage.assertDirectCheckoutBypassesPaymentAndAddress();
    await checkoutPage.page.waitForTimeout(1500);
  });

  test('TC-CHK-010: UI: Terms of Service Agreement Unchecked Warning @ui @regression @REQ-01', async ({ checkoutPage }) => {
    await checkoutPage.clearCart();
    await checkoutPage.addSufficientProductsToCart();
    await checkoutPage.navigate();
    await checkoutPage.dismissModals();

    const termsBox = checkoutPage.termsOfServiceCheckbox;
    await expect(termsBox).toBeVisible({ timeout: 10000 });
    await termsBox.uncheck({ force: true }).catch(() => {});

    const checkoutBtn = checkoutPage.proceedToCheckoutButton;
    await expect(checkoutBtn).toBeVisible({ timeout: 10000 });
    await checkoutBtn.click({ force: true });
    await checkoutPage.page.waitForTimeout(2000);

    await checkoutPage.assertTermsOfServiceWarningDisplayed();
    await checkoutPage.page.waitForTimeout(1500);
  });

});
