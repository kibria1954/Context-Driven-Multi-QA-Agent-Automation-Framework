# 📊 Executive Test Report — `wishlist-management`

- **Story**: `wishlist-management`
- **Pass Rate**: **39%**
- **Total Tests**: 18 | ✅ Passed: 7 | ❌ Failed: 1 | ⏭️ Skipped: 10
- **Report Generated**: `8/24/2026, 5:06:14 PM`

---

## 📋 Test Execution Table

| TC-ID | Scenario Name | Browser | Type | Status | Duration | REQ-ID | Failure Reason |
|---|---|---|---|---|---|---|---|
| `TC-001` | Customer navigates to Wishlist via My Account dashboard sidebar | `storefront-chromium` | `positive` | ✅ PASSED | 10.2s | `REQ-01` | — |
| `TC-002` | Unauthenticated user directly requesting the Wishlist URL is redirected to login | `storefront-chromium` | `positive` | ✅ PASSED | 6.6s | `REQ-01` | — |
| `TC-003` | Customer navigates to Wishlist via the header navbar wishlist icon | `storefront-chromium` | `positive` | ✅ PASSED | 13.0s | `REQ-02` | — |
| `TC-004` | Header wishlist icon navigates correctly from a non-home page | `storefront-chromium` | `positive` | ✅ PASSED | 10.1s | `REQ-02` | — |
| `TC-005` | Wishlist page displays a product card with item details and a remove action | `storefront-chromium` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-03` | — |
| `TC-006` | Wishlist page displays one card per saved product for multiple items | `storefront-chromium` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-03` | — |
| `TC-007` | Unauthenticated user cannot view populated Wishlist content directly via URL | `storefront-chromium` | `positive` | ✅ PASSED | 6.5s | `REQ-03` | — |
| `TC-008` | A discontinued/out-of-stock product in the wishlist renders without breaking the page | `storefront-chromium` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-03` | — |
| `TC-009` | Wishlist with a large number of items (20+) renders without breaking layout | `storefront-chromium` | `positive` | ⏭️ SKIPPED | 157.0s | `REQ-03` | Error: wishlist cleanup did not converge to empty — a remove click was likely absorbed by a reappearing overlay  expect(locator).toHaveCount(expected) failed  Locator:  locator('button.wishlist-remove |
| `TC-010` | Empty wishlist displays "Your wishlist is empty." and a working "Browse products" button | `storefront-chromium` | `edge` | ✅ PASSED | 4.8s | `REQ-04` | — |
| `TC-011` | "Browse products" button navigates to the home page | `storefront-chromium` | `positive` | ✅ PASSED | 8.9s | `REQ-04` | — |
| `TC-012` | Clicking the wishlist button on a product card adds it with a success message | `storefront-chromium` | `positive` | ❌ FAILED | 48.8s | `REQ-05` | Error: expect(locator).toHaveText(expected) failed  Locator: locator('a.header-link-wishlist span.wishlist-qty') Expected pattern: /\(1\)/ Received string:  "(3)" Timeout: 10000ms  Call log:   - Expec |
| `TC-013` | Clicking the wishlist button on the product detail page adds it with a success message | `storefront-chromium` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-05` | — |
| `TC-014` | Re-adding an already-wishlisted product repeats the success message and increments the header count, but does not duplicate the grid entry | `storefront-chromium` | `negative` | ⏭️ SKIPPED | 0.0s | `REQ-05` | — |
| `TC-015` | Rapid double-click on "Add to wishlist" does not create a duplicate entry | `storefront-chromium` | `negative` | ⏭️ SKIPPED | 0.0s | `REQ-05` | — |
| `TC-016` | Add-to-wishlist AJAX request returns 200 and reflects in the DOM without a full page reload | `storefront-chromium` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-05` | — |
| `TC-017` | Header wishlist count increments by 1 immediately after adding a new product | `storefront-chromium` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-06` | — |
| `TC-018` | Header wishlist count decrements by 1 immediately after removing an item | `storefront-chromium` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-06` | — |
