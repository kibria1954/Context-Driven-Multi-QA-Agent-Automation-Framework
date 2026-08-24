# Live Site Verification — Wishlist Management

**Feature:** `wishlist-management` | **Verified:** 2026-08-21 | **Environment:** staging (`https://kbd.nop-station.site`) | **Overall Status:** ⚠️ PARTIAL (one open discrepancy escalated, one TC formally deferred)

---

## Summary of What Was Confirmed

| Area | Confirmed Selector / Behavior |
|---|---|
| Sidebar nav (My Account → Wishlist) | `li.b2bcustomer-wishlist a`, href `/korean-wishlist` |
| Header nav icon | `a.header-link-wishlist` (`a.ico-wishlist`), href `/wishlist` |
| Header count badge | `a.header-link-wishlist span.wishlist-qty` |
| Empty-state message | Verbatim: **"Your wishlist is empty."** + "Browse products" link → `/` |
| Product card (populated) | `article.wishlist-item[data-productid]`, `h2.product-title a`, `span.price.actual-price` |
| Remove action | `button.wishlist-remove-btn`, `onclick="removeWishlistItem({wishlistItemId}, this)"` |
| Add-to-wishlist button | `#add-to-wishlist-button-{productId}` (`button.add-to-wishlist-button`), title="Add to wishlist" |
| Add-to-wishlist AJAX | `POST /addproducttocart/details/{productId}/2` → 200 |
| Success notification | Verbatim: **"The product has been added to your wishlist"** |
| Guest access to `/wishlist` | Redirects to `/login` exactly |

---

## ⚠️ Open Discrepancy: Header Count Doesn't De-Duplicate (D-011)

Re-clicking "Add to wishlist" on a product already in the wishlist:
- Fires the same AJAX call again (200 OK)
- Shows the same success message again
- **Increments the header count again** (e.g. `(1)` → `(2)`)
- Does **NOT** create a second card on the Wishlist page (grid stays deduplicated by product)

Net effect: the header can show a number higher than the number of products actually visible on the Wishlist page. This has been recorded in `memory/decisions.md` (D-011) as an open question for the product owner — intended behavior or a bug — and is **not** silently absorbed into test expectations. `TC-014`, `TC-017`, `TC-018` have been updated to assert the observed reality rather than an assumption.

## ⛔ Deferred: TC-008 (Discontinued/Out-of-Stock Product)

Searched live across 9 catalog terms (cream, toner, mask, serum, set, oil, cleanser, sunscreen, lotion), covering 24+ distinct products — found zero "out of stock" occurrences anywhere. This staging catalog has no discontinued/out-of-stock product currently configured. TC-008 is deferred rather than automated against an invented fixture. If the owner names a specific SKU, this can be revisited.

## Popups / Overlays (3 distinct, can block clicks)

| Popup | Selector | Already handled by `dismissAllModals()`? |
|---|---|---|
| Welcome modal | `#kdn-welcome-modal` | ✅ Yes (confirmed by reading source) |
| Promo overlay (auto-opens) | `#multi-popup-overlay` | ✅ Yes |
| Newsletter jQuery UI dialog | `.news-letter-popup-modal` + `.ui-widget-overlay` | ❌ **No** — needs adding before Stage 5 codegen |

## Accessibility (axe-core, non-blocking)

4 violations found, identical on both empty and populated Wishlist pages (all in shared header/layout markup, not wishlist-specific): `aria-allowed-attr` (critical, `.header-account-trigger`), `aria-input-field-name` (serious, `#SearchCategoryId-button`), `landmark-unique` (moderate, `.mm-navbar--grid`), `region` (moderate, homepage carousel present in shared layout). Logged to `memory/a11y-findings.md`.

## Visual Baselines

- `workflows/wishlist-management/visual/wishlist-empty.png`
- `workflows/wishlist-management/visual/wishlist-populated.png`
- `workflows/wishlist-management/visual/product-detail-page.png`
- `workflows/wishlist-management/visual/add-to-wishlist-success-notification.png`
- `workflows/wishlist-management/visual/guest-wishlist-access.png`

## Data Dependency Resolutions

- **TC-009 (20+ items):** resolved — 21 real, distinct product slugs recorded in `testdata/wishlist-management/seed.json`.
- **TC-006 (2 items):** `/gel-cream` confirmed live alongside `/cream`.

## Infrastructure

Reuses the shared `tests/global-setup.ts` / `tests/.auth/customer.json` auth infrastructure (`.Nop.Authentication` cookie, D-003) — already verified for other features, confirmed working (not re-verified from scratch) before this exploration began.

See `workflows/wishlist-management.verify.json` for the full machine-readable selector/DOM record.
