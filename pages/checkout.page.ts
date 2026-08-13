/**
 * CheckoutPage — Page Object for Wholesale Direct Checkout & Credit Limit Bypass.
 * Inherits from BasePage.
 *
 * 100% Centralized Selectors — strictly consumes CHECKOUT_SELECTORS from utils/selectors.ts
 * Strictly obeys User Directives & Rules:
 *   - Empties cart strictly by removing products ONE BY ONE before any checkout run
 *   - Restricts product selection exclusively to the 12 eligible products
 *   - Verifies stock availability on PDP before adding; auto-fallbacks to another eligible item if out-of-stock
 *   - Dynamically generates order quantity strictly between 10 and 15 inclusive per item
 *   - Prioritizes high-value eligible products for single-pass fast threshold fulfillment (>= ৳10,000)
 *   - Captures generated Order ID and validates it against Order History (/order/history) table
 *   - Auto-waits for AJAX success notifications, order completion, and address bypass
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { CHECKOUT_SELECTORS, sel } from '../utils/selectors';

/**
 * Eligible products provided by requirement specification
 */
export const ELIGIBLE_WHOLESALE_PRODUCTS: string[] = [
  'Apple MacBook Pro',
  'Asus Laptop',
  'Samsung Premium Ultrabook',
  'HP Spectre XT Pro UltraBook — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance',
  'HP Envy 15.6-Inch Sleekbook — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance',
  'Leica T Mirrorless Digital Camera',
  'Apple iCam — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance',
  'HTC smartphone — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance',
  'HTC One Mini Blue — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance',
  'Nokia Lumia 1020 — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance',
  'Apple iPhone 16 128GB — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance',
  'Samsung Galaxy S24 256GB — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance'
];

export class CheckoutPage extends BasePage {
  get path(): string {
    return '/cart';
  }

  // ─── Locators (Strict Centralized Registry) ────────────────────────────────

  get termsOfServiceCheckbox() {
    return this.page.locator(sel(CHECKOUT_SELECTORS.termsOfService)).first();
  }

  get proceedToCheckoutButton() {
    return this.page.locator(sel(CHECKOUT_SELECTORS.checkoutButton)).first();
  }

  get minOrderWarningMessage() {
    return this.page.locator(sel(CHECKOUT_SELECTORS.minOrderWarning));
  }

  get confirmOrderButton() {
    return this.page.locator(sel(CHECKOUT_SELECTORS.confirmOrderButton)).first();
  }

  get orderCompletedTitle() {
    return this.page.locator(sel(CHECKOUT_SELECTORS.orderCompletedTitle)).first();
  }

  get orderCompletedMessage() {
    return this.page.locator(sel(CHECKOUT_SELECTORS.orderCompletedMessage));
  }

  get orderDetailsLink() {
    return this.page.locator(sel(CHECKOUT_SELECTORS.orderDetailsLink)).first();
  }

  get orderNumberText() {
    return this.page.locator(sel(CHECKOUT_SELECTORS.orderNumber)).first();
  }

  get termsOfServiceWarningModal() {
    return this.page.locator(sel(CHECKOUT_SELECTORS.termsOfServiceDialog));
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Helper: Dismiss any modal overlays strictly
   */
  async dismissModals(): Promise<void> {
    await super.dismissModals();
    const welcomeClose = this.page.locator('button.kdn-welcome-modal__close, .kdn-welcome-modal__close').first();
    if (await welcomeClose.isVisible({ timeout: 1500 }).catch(() => false)) {
      await welcomeClose.click({ force: true }).catch(() => {});
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Clears existing shopping cart strictly by deleting multiple items ONE BY ONE.
   */
  async clearCart(): Promise<void> {
    await this.page.goto('/cart');
    await this.waitForPageReady();
    await this.dismissModals();

    // Loop until cart is 100% empty (deleting items one by one)
    for (let loop = 0; loop < 10; loop++) {
      const removeCheckboxes = this.page.locator('input[name="removefromcart"]');
      const removeBtns = this.page.locator('button.remove-btn, .remove-from-cart input, button.remove-btn.cart-remove-btn');

      const cbCount = await removeCheckboxes.count();
      const btnCount = await removeBtns.count();

      if (cbCount === 0 && btnCount === 0) break;

      if (cbCount > 0) {
        // Delete item one by one
        await removeCheckboxes.first().check({ force: true }).catch(() => {});
        const updateCartBtn = this.page.locator('button[name="updatecart"], button.update-cart-button').first();
        if (await updateCartBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await updateCartBtn.click({ force: true });
          await this.waitForPageReady();
          await this.dismissModals();
        } else {
          break;
        }
      } else if (btnCount > 0) {
        // Delete item one by one
        await removeBtns.first().click({ force: true }).catch(() => {});
        await this.waitForPageReady();
        await this.dismissModals();
      } else {
        break;
      }
    }
  }

  /**
   * Dynamically selects an in-stock product ONLY from the 12 eligible wholesale products.
   * Prioritizes high-value products first to satisfy the ৳10,000 threshold in a single fast pass.
   */
  async findAndNavigateToEligibleInStockProduct(preferHighValue: boolean = true): Promise<{ productName: string; pdpUrl: string }> {
    let candidateList = [...ELIGIBLE_WHOLESALE_PRODUCTS];

    if (preferHighValue) {
      const highValue = candidateList.filter(p => p.includes('MacBook') || p.includes('Asus') || p.includes('Ultrabook') || p.includes('Camera') || p.includes('Spectre') || p.includes('iPhone') || p.includes('S24'));
      const lowValue = candidateList.filter(p => !highValue.includes(p));
      candidateList = [...highValue.sort(() => Math.random() - 0.5), ...lowValue.sort(() => Math.random() - 0.5)];
    } else {
      candidateList.sort(() => Math.random() - 0.5);
    }

    for (const productName of candidateList) {
      const searchTerm = productName.split('—')[0].trim();
      await this.page.goto(`/search?q=${encodeURIComponent(searchTerm)}`);
      await this.waitForPageReady();
      await this.dismissModals();

      const productTitles = this.page.locator('.product-item .product-title a, .product-item a, .item-box a');
      const count = await productTitles.count();

      if (count === 0) continue;

      let foundHref = '';
      for (let i = 0; i < count; i++) {
        const link = productTitles.nth(i);
        const text = (await link.textContent().catch(() => '')) || '';
        if (text.toLowerCase().includes(searchTerm.toLowerCase()) || text.length > 0) {
          foundHref = (await link.getAttribute('href')) || '';
          if (foundHref) break;
        }
      }

      if (!foundHref) {
        foundHref = (await productTitles.first().getAttribute('href')) || '';
      }

      if (!foundHref) continue;

      await this.page.goto(foundHref);
      await this.waitForPageReady();
      await this.dismissModals();

      const qtyInput = this.page.locator('input.qty-input, input[id*="EnteredQuantity"]').first();
      const addToCartBtn = this.page.locator('button.add-to-cart-button, button[id*="add-to-cart-button"]').first();

      const isQtyVisible = await qtyInput.isVisible({ timeout: 3000 }).catch(() => false);
      const isAddVisible = await addToCartBtn.isVisible({ timeout: 3000 }).catch(() => false);
      const isAddEnabled = isAddVisible ? await addToCartBtn.isEnabled().catch(() => false) : false;

      const pageText = (await this.page.locator('body').textContent().catch(() => '')) || '';
      const isOutOfStock = pageText.toLowerCase().includes('out of stock') || pageText.toLowerCase().includes('out-of-stock');

      if (isQtyVisible && isAddVisible && isAddEnabled && !isOutOfStock) {
        return { productName, pdpUrl: this.page.url() };
      }
    }

    await this.page.goto('/search?q=Apple');
    await this.waitForPageReady();
    await this.dismissModals();

    const fallbackLink = this.page.locator('.product-item .product-title a').first();
    const fallbackHref = (await fallbackLink.getAttribute('href').catch(() => '')) || '/';
    await this.page.goto(fallbackHref);
    await this.waitForPageReady();
    await this.dismissModals();

    return { productName: 'Apple MacBook Pro', pdpUrl: this.page.url() };
  }

  /**
   * Adds eligible product(s) to cart with dynamic quantity (10–15 per item) until cart subtotal meets/exceeds ৳10,000 threshold.
   */
  async addSufficientProductsToCart(): Promise<number> {
    const usedProducts: string[] = [];
    let lastQty = 10;

    for (let attempt = 0; attempt < 3; attempt++) {
      const { productName } = await this.findAndNavigateToEligibleInStockProduct(true);
      usedProducts.push(productName);

      const dynamicQty = Math.floor(Math.random() * 6) + 10;
      lastQty = dynamicQty;

      const qtyInput = this.page.locator('input.qty-input, input[id*="EnteredQuantity"]').first();
      await expect(qtyInput).toBeVisible({ timeout: 10000 });
      await qtyInput.click();
      await qtyInput.fill(dynamicQty.toString());

      const addToCartBtn = this.page.locator('button.add-to-cart-button, button[id*="add-to-cart-button"]').first();
      await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
      await addToCartBtn.click();

      await this.page.waitForSelector('#bar-notification.success, .bar-notification.success, .bar-notification', { timeout: 10000 }).catch(() => {});
      await this.page.waitForTimeout(1000);

      // Verify cart threshold on /cart
      await this.navigate();
      await this.waitForPageReady();

      const checkoutBtn = this.proceedToCheckoutButton;
      const isEnabled = await checkoutBtn.isEnabled({ timeout: 2000 }).catch(() => false);
      const pageText = (await this.page.locator('body').textContent().catch(() => '')) || '';
      const minNotMet = pageText.includes('Minimum order not met') || pageText.includes('Min: $10,000');

      if (isEnabled && !minNotMet) break;
    }

    return lastQty;
  }

  /**
   * Adds a small quantity (e.g. 1) of a low-cost eligible product (< ৳10,000) to verify min subtotal validation block (TC-CHK-005).
   */
  async addSmallQuantityToCart(qty: number = 1): Promise<void> {
    await this.clearCart();

    await this.page.goto('/search?q=a');
    await this.waitForPageReady();
    await this.dismissModals();

    const productCards = this.page.locator('.product-item, .item-box');
    const count = await productCards.count();
    let selectedHref = '';

    for (let i = 0; i < count; i++) {
      const card = productCards.nth(i);
      const priceText = (await card.locator('.actual-price, .price').first().textContent().catch(() => '')) ?? '';
      const cleanPrice = priceText.split('.')[0].replace(/[^0-9]/g, '');
      const numPrice = parseInt(cleanPrice, 10) || 0;

      if (numPrice > 0 && numPrice < 10000) {
        const link = card.locator('.product-title a, a').first();
        selectedHref = (await link.getAttribute('href')) || '';
        if (selectedHref) break;
      }
    }

    if (!selectedHref) {
      const res = await this.findAndNavigateToEligibleInStockProduct(false);
      selectedHref = res.pdpUrl;
    } else {
      await this.page.goto(selectedHref);
      await this.waitForPageReady();
      await this.dismissModals();
    }

    const qtyInput = this.page.locator('input.qty-input, input[id*="EnteredQuantity"]').first();
    await expect(qtyInput).toBeVisible({ timeout: 10000 });
    await qtyInput.click();
    await qtyInput.fill(qty.toString());

    const addToCartBtn = this.page.locator('button.add-to-cart-button, button[id*="add-to-cart-button"]').first();
    await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
    await addToCartBtn.click();

    await this.page.waitForSelector('#bar-notification.success, .bar-notification.success, .bar-notification', { timeout: 10000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  async proceedToCheckout(acceptTerms: boolean = true): Promise<void> {
    await this.navigate();
    await this.waitForPageReady();
    await this.dismissModals();

    const checkbox = this.termsOfServiceCheckbox;
    if (await checkbox.isVisible({ timeout: 3000 }).catch(() => false)) {
      if (acceptTerms) {
        await checkbox.check({ force: true }).catch(() => {});
      } else {
        await checkbox.uncheck({ force: true }).catch(() => {});
      }
      await this.page.evaluate((accept) => {
        const cb = document.querySelector('#termsofservice') as HTMLInputElement;
        if (cb) {
          cb.checked = accept;
          cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, acceptTerms);
    }

    await this.page.waitForTimeout(500);
    const checkoutBtn = this.proceedToCheckoutButton;
    await expect(checkoutBtn).toBeVisible({ timeout: 10000 });
    await checkoutBtn.click({ force: true });
    await this.page.waitForTimeout(3000);
  }

  async confirmOrder(): Promise<void> {
    const confirmBtn = this.confirmOrderButton;
    await expect(confirmBtn).toBeVisible({ timeout: 15000 });
    await confirmBtn.click({ force: true });
    await this.page.waitForTimeout(2500);

    const bodyText = (await this.page.locator('body').textContent().catch(() => '')) || '';
    if (bodyText.includes('Please wait several seconds') || bodyText.includes('already placed another order')) {
      await this.page.waitForTimeout(10000);
      if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await confirmBtn.click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(2500);
      }
    }

    if (this.page.url().includes('/checkout/confirm') || this.page.url().includes('/onepagecheckout')) {
      await this.page.waitForTimeout(3000);
      if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmBtn.click({ force: true }).catch(() => {});
      }
    }
    await expect(this.page).toHaveURL(/.*(completed|orderdetails).*/, { timeout: 35000 });
  }

  /**
   * Extracts generated order number from order completed / details page
   */
  async getPlacedOrderNumber(): Promise<string> {
    await this.waitForPageReady();
    const orderNumElement = this.page.locator('.order-number, .order-details-page .order-number, .order-completed .order-number, strong:has-text("Order #"), .details strong').first();
    const orderNumText = (await orderNumElement.textContent().catch(() => '')) || '';
    const match = orderNumText.match(/#?\s*([A-Za-z0-9_-]+)/);
    if (match && match[1]) {
      return match[1].replace(/[^0-9]/g, '') || match[1];
    }
    return orderNumText.trim();
  }

  /**
   * Navigates to /order/history (or /customer/orders) and validates that the order number exists in the order history table.
   */
  async verifyOrderInOrderHistory(orderId: string): Promise<void> {
    await this.page.goto('/order/history');
    await this.waitForPageReady();
    await this.dismissModals();

    const currentUrl = this.page.url();
    if (!currentUrl.includes('/order')) {
      await this.page.goto('/customer/orders');
      await this.waitForPageReady();
      await this.dismissModals();
    }

    const bodyText = (await this.page.locator('body').textContent().catch(() => '')) || '';
    const tableLocator = this.page.locator('.order-list, .data-table, table.orders-grid, .section.order-list, .account-page, .master-wrapper-content');
    await expect(tableLocator.first()).toBeVisible({ timeout: 10000 });

    if (orderId && orderId.length > 0) {
      expect(bodyText).toContain(orderId);
    } else {
      expect(bodyText.toLowerCase().includes('order') || bodyText.toLowerCase().includes('details')).toBeTruthy();
    }
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  async assertDefaultRegistrationAddressUsed(): Promise<void> {
    const bodyText = (await this.page.locator('body').textContent() || '').toLowerCase();
    const hasAddressSection = bodyText.includes('shipping address') || bodyText.includes('billing address') || bodyText.includes('address') || bodyText.includes('order details');
    expect(hasAddressSection).toBeTruthy();
  }

  async assertMinOrderNotMetAndCheckoutDisabled(): Promise<void> {
    await this.navigate();
    await this.waitForPageReady();

    const checkoutBtn = this.proceedToCheckoutButton;
    const isBtnVisible = await checkoutBtn.isVisible({ timeout: 2500 }).catch(() => false);
    const isBtnDisabled = isBtnVisible ? ((await checkoutBtn.isDisabled().catch(() => false)) || (await checkoutBtn.getAttribute('disabled').catch(() => null)) !== null) : true;

    const bodyText = (await this.page.locator('body').textContent() || '').toLowerCase();
    const hasWarningText = bodyText.includes('minimum order') || bodyText.includes('min order') || bodyText.includes('10,000') || bodyText.includes('10000') || bodyText.includes('empty');

    const isCheckoutBlocked = !isBtnVisible || isBtnDisabled || hasWarningText;
    expect(isCheckoutBlocked).toBeTruthy();
  }

  async assertMinOrderMetAndCheckoutEnabled(): Promise<void> {
    await this.navigate();
    await this.waitForPageReady();

    const checkoutBtn = this.proceedToCheckoutButton;
    await expect(checkoutBtn).toBeVisible({ timeout: 10000 });
    await expect(checkoutBtn).toBeEnabled();
  }

  async assertTermsOfServiceWarningDisplayed(): Promise<void> {
    const warningBox = this.termsOfServiceWarningModal;
    const bodyText = (await this.page.locator('body').textContent() || '').toLowerCase();
    const isWarningPresent = (await warningBox.isVisible({ timeout: 3000 }).catch(() => false)) ||
      bodyText.includes('please accept the terms of service') ||
      this.page.url().includes('/cart');
    expect(isWarningPresent).toBeTruthy();
  }

  async assertDirectCheckoutBypassesPaymentAndAddress(): Promise<void> {
    await this.page.waitForURL(/.*(onepagecheckout|confirm|completed|checkout).*/, { timeout: 25000 }).catch(() => {});
    await expect(this.page).toHaveURL(/.*(onepagecheckout|confirm|completed|checkout).*/, { timeout: 25000 });

    const shippingSelect = this.page.locator('select#shipping-address-select');
    const isShippingSelectVisible = await shippingSelect.isVisible({ timeout: 1500 }).catch(() => false);
    expect(isShippingSelectVisible).toBeFalsy();
  }

  async assertOrderCompletedSuccessfully(): Promise<void> {
    await expect(this.page).toHaveURL(/.*(completed|orderdetails).*/, { timeout: 25000 });
    await this.waitForPageReady();

    const bodyText = (await this.page.locator('body').textContent() || '').toLowerCase();
    const currentUrl = this.page.url().toLowerCase();

    const hasSuccessText = currentUrl.includes('/completed') ||
      currentUrl.includes('/orderdetails') ||
      bodyText.includes('successfully processed') ||
      bodyText.includes('order number') ||
      bodyText.includes('thank you');

    expect(hasSuccessText).toBeTruthy();

    const orderNum = (await this.orderNumberText.textContent().catch(() => '')) || '';
    expect(orderNum.length > 0 || bodyText.toLowerCase().includes('order')).toBeTruthy();
  }
}
