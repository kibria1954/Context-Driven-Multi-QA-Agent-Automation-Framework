# Test Scenarios — Wishlist Management (Stakeholder Review)

## What We're Testing

Wholesale customers can save products they're interested in to a personal Wishlist and manage it later. The Wishlist is reachable two ways — from the account dashboard sidebar, or from an icon in the site header — and both lead to the same page. Customers can add a product from a listing or its detail page, see it appear on the Wishlist page, and remove it again; the header's wishlist count always reflects what's actually saved.

## Scenarios

### ✅ Happy Path Scenarios
1. **Two ways to reach the Wishlist** — A customer opens the Wishlist either via "My Account" or by clicking the wishlist icon in the header. ✅ Expected: both lead to the same Wishlist page.
2. **Viewing saved products** — A customer with saved products opens the Wishlist. ✅ Expected: each product shows as its own card with name, price, a Remove option, and an Add to cart option.
3. **Adding a product** — A customer clicks the wishlist ("♡") button on a product card or its detail page. ✅ Expected: a confirmation message appears ("The product has been added to your wishlist") and the header's wishlist count goes up by one.
4. **Removing a product** — A customer clicks Remove on a saved product. ✅ Expected: the product disappears from the list and the header count goes down by one.

### ❌ Error Handling Scenarios
5. **Not logged in** — Someone who isn't logged in tries to open the Wishlist page directly. ❌ Expected: they're redirected to log in first (exact redirect behavior to be confirmed against the live site before this test is automated).
6. **Adding the same product twice** — A customer clicks the wishlist button on a product that's already saved. ⚠️ **Confirmed on the live site, flagged for a product decision:** the same "added to your wishlist" message appears again and the header count goes up again (e.g. to "2"), but the Wishlist page still only shows the one product once. So the header number can end up higher than the number of products actually listed. This has been recorded for the product owner to decide whether it's intended — it has NOT been quietly "fixed" in the test expectations.

### 🔲 Edge Cases
7. **Empty Wishlist** — A customer with nothing saved opens the Wishlist. 🔲 Expected: a friendly "Your wishlist is empty." message with a "Browse products" button that takes them to the home page.
8. **Double-clicking Add to Wishlist** — A customer accidentally double-clicks the wishlist button. 🔲 Expected: the product is only added once, not duplicated.
9. **A large wishlist** — A customer has saved 20+ products. 🔲 Expected: the page still displays cleanly without breaking.
10. **A discontinued product on the list** — A previously-saved product is later discontinued or goes out of stock. 🔲 Expected: the Wishlist page still renders without errors (exact handling — e.g. an out-of-stock label vs. hiding the item — will be confirmed against the live site).
