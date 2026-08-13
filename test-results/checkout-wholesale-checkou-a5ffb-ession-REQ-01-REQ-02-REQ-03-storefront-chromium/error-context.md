# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout\wholesale-checkout.spec.ts >> Wholesale Checkout Suite >> TC-CHK-001-004-008: Nested E2E Flow: Cart Addition -> Subtotal Threshold -> Direct Checkout -> Credit Limit Bypass -> Address Locking & Order History Validation @smoke @regression @REQ-01 @REQ-02 @REQ-03
- Location: tests\e2e\checkout\wholesale-checkout.spec.ts:36:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button#checkout, button.checkout-button').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('button#checkout, button.checkout-button').first()

```

```yaml
- status
- group "1 / 1": Free shipping on all orders above ৳100
- button "Announcement Minimize or maximize": 
- banner:
  - link "Skip navigation":
    - /url: "#main"
  - link "Your store name":
    - /url: /
    - img "Your store name"
  - search:
    - combobox: All categories
    - textbox "Search store":
      - /placeholder: Search for K-Beauty products, brands, ingredients...
    - button "Search"
  - list:
    - listitem:
      - link "Wishlist":
        - /url: /wishlist
        - text:  Wishlist (0)
    - listitem: user
    - listitem:
      - link "Shopping cart":
        - /url: /cart
        - text:  Shopping cart (0)
      - text: "0"
    - listitem:
      - link "Quick Order":
        - /url: /Favourites
  - text:  K-Beauty Categories 
  - navigation:
    - list:
      - listitem:
        - link "The picture of Brand Brand":
          - /url: /manufacturer/all
          - img "The picture of Brand"
          - text: Brand
      - listitem:
        - link "The picture of Promotion Promotion":
          - /url: /promotions
          - img "The picture of Promotion"
          - text: Promotion
      - listitem:
        - link "The picture of Box Damage Box Damage":
          - /url: /box-damage
          - img "The picture of Box Damage"
          - text: Box Damage
      - listitem:
        - link "The picture of Restock Request Restock Request":
          - /url: /restock-request
          - img "The picture of Restock Request"
          - text: Restock Request
      - listitem:
        - link "The picture of Pre-Order Pre-Order":
          - /url: /
          - img "The picture of Pre-Order"
          - text: Pre-Order
  - text:  Support 
- main:
  - heading "Shopping cart" [level=1]
  - paragraph: Your Shopping Cart is empty!
  - paragraph: Explore our catalogue and add products to start your order.
  - link "Continue shopping":
    - /url: /
- contentinfo:
  - img "Your store name"
  - paragraph: Distributor | Importer | Wholesaler | Retailer
  - paragraph: Bangladesh’s No.1 Korean Cosmetics Wholesale Supplier
  - paragraph: The widest range of authentic Korean skincare in stock official distributor for leading K-beauty brands. Best wholesale prices, 100% authenticity guaranteed, with fastest nationwide delivery.
  - link " info@koreandemandsbd.com":
    - /url: mailto:info@koreandemandsbd.com
  - list:
    - listitem:
      - link " Facebook":
        - /url: https://www.facebook.com/nopCommerce
    - listitem:
      - link " WhatsApp":
        - /url: https://wa.me/01721111111
    - listitem:
      - link " Twitter":
        - /url: https://twitter.com/nopCommerce
    - listitem:
      - link " Instagram":
        - /url: https://www.instagram.com/nopcommerce_official
    - listitem:
      - link " Email":
        - /url: mailto:info@koreandemandsbd.com
    - listitem:
      - link " YouTube":
        - /url: https://www.youtube.com/user/nopCommerce
  - navigation:
    - heading "Information" [level=2]
    - menu "Information":
      - menuitem "Sitemap":
        - link "Sitemap":
          - /url: /sitemap
      - menuitem "Shipping & returns":
        - link "Shipping & returns":
          - /url: /shipping-returns
      - menuitem "Privacy notice":
        - link "Privacy notice":
          - /url: /privacy-notice
      - menuitem "Conditions of Use":
        - link "Conditions of Use":
          - /url: /conditions-of-use
      - menuitem "About us":
        - link "About us":
          - /url: /about-us
      - menuitem "Contact us":
        - link "Contact us":
          - /url: /contactus
    - heading "Customer service" [level=2]
    - menu "Customer service":
      - menuitem "Search":
        - link "Search":
          - /url: /search
      - menuitem "News":
        - link "News":
          - /url: /news
      - menuitem "Blog":
        - link "Blog":
          - /url: /blog
      - menuitem "Recently viewed products":
        - link "Recently viewed products":
          - /url: /recentlyviewedproducts
      - menuitem "Compare products list":
        - link "Compare products list":
          - /url: /compareproducts
      - menuitem "New products":
        - link "New products":
          - /url: /newproducts
    - heading "My account" [level=2]
    - menu "My account":
      - menuitem "My account":
        - link "My account":
          - /url: /customer/info
      - menuitem "Orders":
        - link "Orders":
          - /url: /order/history
      - menuitem "Addresses":
        - link "Addresses":
          - /url: /customer/addresses
      - menuitem "Shopping cart":
        - link "Shopping cart":
          - /url: /cart
      - menuitem "Wishlist":
        - link "Wishlist":
          - /url: /wishlist
      - menuitem "Apply for vendor account":
        - link "Apply for vendor account":
          - /url: /vendor/apply
  - text: 
  - paragraph: "Korea Warehouse: 2001-12, 101, Jeongwang-dong,"
  - paragraph: Siheung-si,Gyeonggi-do, Republic of Korea
  - text: " Bangladesh Warehouse: 72, Arjatpara Road, Mohakhali, Dhaka – 1215  Bangladesh Retail Shop: Shop #07, Level-1, Block-C, SKS Tower, Mohakhali, Dhaka, Bangladesh Copyright © 2026 Your store name. All rights reserved."
  - img "Supported Cards"
  - text: Powered by
  - link "nopCommerce":
    - /url: https://www.nopcommerce.com/
```

# Test source

```ts
  318 | 
  319 |     await this.page.waitForTimeout(500);
  320 |     const checkoutBtn = this.proceedToCheckoutButton;
  321 |     await expect(checkoutBtn).toBeVisible({ timeout: 10000 });
  322 |     await checkoutBtn.click({ force: true });
  323 |     await this.page.waitForTimeout(3000);
  324 |   }
  325 | 
  326 |   async confirmOrder(): Promise<void> {
  327 |     const confirmBtn = this.confirmOrderButton;
  328 |     await expect(confirmBtn).toBeVisible({ timeout: 15000 });
  329 |     await confirmBtn.click({ force: true });
  330 |     await this.page.waitForTimeout(2500);
  331 | 
  332 |     const bodyText = (await this.page.locator('body').textContent().catch(() => '')) || '';
  333 |     if (bodyText.includes('Please wait several seconds') || bodyText.includes('already placed another order')) {
  334 |       await this.page.waitForTimeout(10000);
  335 |       if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  336 |         await confirmBtn.click({ force: true }).catch(() => {});
  337 |         await this.page.waitForTimeout(2500);
  338 |       }
  339 |     }
  340 | 
  341 |     if (this.page.url().includes('/checkout/confirm') || this.page.url().includes('/onepagecheckout')) {
  342 |       await this.page.waitForTimeout(3000);
  343 |       if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  344 |         await confirmBtn.click({ force: true }).catch(() => {});
  345 |       }
  346 |     }
  347 |     await expect(this.page).toHaveURL(/.*(completed|orderdetails).*/, { timeout: 35000 });
  348 |   }
  349 | 
  350 |   /**
  351 |    * Extracts generated order number from order completed / details page
  352 |    */
  353 |   async getPlacedOrderNumber(): Promise<string> {
  354 |     await this.waitForPageReady();
  355 |     const orderNumElement = this.page.locator('.order-number, .order-details-page .order-number, .order-completed .order-number, strong:has-text("Order #"), .details strong').first();
  356 |     const orderNumText = (await orderNumElement.textContent().catch(() => '')) || '';
  357 |     const match = orderNumText.match(/#?\s*([A-Za-z0-9_-]+)/);
  358 |     if (match && match[1]) {
  359 |       return match[1].replace(/[^0-9]/g, '') || match[1];
  360 |     }
  361 |     return orderNumText.trim();
  362 |   }
  363 | 
  364 |   /**
  365 |    * Navigates to /order/history (or /customer/orders) and validates that the order number exists in the order history table.
  366 |    */
  367 |   async verifyOrderInOrderHistory(orderId: string): Promise<void> {
  368 |     await this.page.goto('/order/history');
  369 |     await this.waitForPageReady();
  370 |     await this.dismissModals();
  371 | 
  372 |     const currentUrl = this.page.url();
  373 |     if (!currentUrl.includes('/order')) {
  374 |       await this.page.goto('/customer/orders');
  375 |       await this.waitForPageReady();
  376 |       await this.dismissModals();
  377 |     }
  378 | 
  379 |     const bodyText = (await this.page.locator('body').textContent().catch(() => '')) || '';
  380 |     const tableLocator = this.page.locator('.order-list, .data-table, table.orders-grid, .section.order-list, .account-page, .master-wrapper-content');
  381 |     await expect(tableLocator.first()).toBeVisible({ timeout: 10000 });
  382 | 
  383 |     if (orderId && orderId.length > 0) {
  384 |       expect(bodyText).toContain(orderId);
  385 |     } else {
  386 |       expect(bodyText.toLowerCase().includes('order') || bodyText.toLowerCase().includes('details')).toBeTruthy();
  387 |     }
  388 |   }
  389 | 
  390 |   // ─── Assertions ────────────────────────────────────────────────────────────
  391 | 
  392 |   async assertDefaultRegistrationAddressUsed(): Promise<void> {
  393 |     const bodyText = (await this.page.locator('body').textContent() || '').toLowerCase();
  394 |     const hasAddressSection = bodyText.includes('shipping address') || bodyText.includes('billing address') || bodyText.includes('address') || bodyText.includes('order details');
  395 |     expect(hasAddressSection).toBeTruthy();
  396 |   }
  397 | 
  398 |   async assertMinOrderNotMetAndCheckoutDisabled(): Promise<void> {
  399 |     await this.navigate();
  400 |     await this.waitForPageReady();
  401 | 
  402 |     const checkoutBtn = this.proceedToCheckoutButton;
  403 |     const isBtnVisible = await checkoutBtn.isVisible({ timeout: 2500 }).catch(() => false);
  404 |     const isBtnDisabled = isBtnVisible ? ((await checkoutBtn.isDisabled().catch(() => false)) || (await checkoutBtn.getAttribute('disabled').catch(() => null)) !== null) : true;
  405 | 
  406 |     const bodyText = (await this.page.locator('body').textContent() || '').toLowerCase();
  407 |     const hasWarningText = bodyText.includes('minimum order') || bodyText.includes('min order') || bodyText.includes('10,000') || bodyText.includes('10000') || bodyText.includes('empty');
  408 | 
  409 |     const isCheckoutBlocked = !isBtnVisible || isBtnDisabled || hasWarningText;
  410 |     expect(isCheckoutBlocked).toBeTruthy();
  411 |   }
  412 | 
  413 |   async assertMinOrderMetAndCheckoutEnabled(): Promise<void> {
  414 |     await this.navigate();
  415 |     await this.waitForPageReady();
  416 | 
  417 |     const checkoutBtn = this.proceedToCheckoutButton;
> 418 |     await expect(checkoutBtn).toBeVisible({ timeout: 10000 });
      |                               ^ Error: expect(locator).toBeVisible() failed
  419 |     await expect(checkoutBtn).toBeEnabled();
  420 |   }
  421 | 
  422 |   async assertTermsOfServiceWarningDisplayed(): Promise<void> {
  423 |     const warningBox = this.termsOfServiceWarningModal;
  424 |     const bodyText = (await this.page.locator('body').textContent() || '').toLowerCase();
  425 |     const isWarningPresent = (await warningBox.isVisible({ timeout: 3000 }).catch(() => false)) ||
  426 |       bodyText.includes('please accept the terms of service') ||
  427 |       this.page.url().includes('/cart');
  428 |     expect(isWarningPresent).toBeTruthy();
  429 |   }
  430 | 
  431 |   async assertDirectCheckoutBypassesPaymentAndAddress(): Promise<void> {
  432 |     await this.page.waitForURL(/.*(onepagecheckout|confirm|completed|checkout).*/, { timeout: 25000 }).catch(() => {});
  433 |     await expect(this.page).toHaveURL(/.*(onepagecheckout|confirm|completed|checkout).*/, { timeout: 25000 });
  434 | 
  435 |     const shippingSelect = this.page.locator('select#shipping-address-select');
  436 |     const isShippingSelectVisible = await shippingSelect.isVisible({ timeout: 1500 }).catch(() => false);
  437 |     expect(isShippingSelectVisible).toBeFalsy();
  438 |   }
  439 | 
  440 |   async assertOrderCompletedSuccessfully(): Promise<void> {
  441 |     await expect(this.page).toHaveURL(/.*(completed|orderdetails).*/, { timeout: 25000 });
  442 |     await this.waitForPageReady();
  443 | 
  444 |     const bodyText = (await this.page.locator('body').textContent() || '').toLowerCase();
  445 |     const currentUrl = this.page.url().toLowerCase();
  446 | 
  447 |     const hasSuccessText = currentUrl.includes('/completed') ||
  448 |       currentUrl.includes('/orderdetails') ||
  449 |       bodyText.includes('successfully processed') ||
  450 |       bodyText.includes('order number') ||
  451 |       bodyText.includes('thank you');
  452 | 
  453 |     expect(hasSuccessText).toBeTruthy();
  454 | 
  455 |     const orderNum = (await this.orderNumberText.textContent().catch(() => '')) || '';
  456 |     expect(orderNum.length > 0 || bodyText.toLowerCase().includes('order')).toBeTruthy();
  457 |   }
  458 | }
  459 | 
```