# Workflow Design — Wishlist Management

**Feature:** `wishlist-management` | **Generated:** 2026-08-21

**State Model:** `S0: item not in wishlist` → `S1: item in wishlist`. This feature has no admin-review lifecycle, so S2–S4 from the standard 5-state model are unused.

> **Key design decision:** unlike `b2b-registration` (fresh namespaced customer per journey), every journey here shares **one pre-existing authenticated customer account** (`tests/.auth/customer.json`). Most journeys therefore mutate shared wishlist-count state and are marked `SERIAL_ONLY` — the opposite default from b2b. Only journeys that are genuinely read-only (no item-count assertion) or use an isolated guest context are `PARALLEL_SAFE`.

---

## J-01: Dual Navigation Entry Points Converge on the Same Page

**Entry State:** S0 | **Exit State:** S0 | **Parallel Safety:** ✅ PARALLEL_SAFE (read-only, no item-count assertion)

1. **[TC-001]** Customer navigates via My Account dashboard sidebar → Wishlist.
2. **[TC-003]** Customer clicks the header wishlist icon from the homepage.
3. **[TC-004]** Customer clicks the header wishlist icon from a product detail page.

All three land on `/wishlist` → `/korean-wishlist`.

---

## J-02: Unauthenticated Access Is Blocked

**Entry State:** S0 | **Exit State:** S0 (redirected to `/login`) | **Parallel Safety:** ✅ PARALLEL_SAFE (isolated guest context)

1. **[TC-002]** Guest navigates directly to `/wishlist`.
2. **[TC-007]** Guest expects to see populated wishlist content — never rendered, redirected instead.

✅ **Confirmed live (2026-08-21):** `/wishlist` redirects to `/login` for an unauthenticated request; the login form renders instead of any wishlist content.

---

## J-03: Empty Wishlist State

**Entry State:** S0 (confirmed empty) | **Exit State:** S0 | **Parallel Safety:** 🔒 SERIAL_ONLY

1. **[TC-010]** Customer with a confirmed-empty wishlist opens the Wishlist page → sees "Your wishlist is empty." + "Browse products" button.
2. **[TC-011]** Clicks "Browse products" → lands on the home page.

Requires the shared account to genuinely be at 0 items — must not run concurrently with any add-journey.

---

## J-04: Add Product via Card, View It, Header Count Increments

**Entry State:** S0 | **Exit State:** S1 | **Parallel Safety:** 🔒 SERIAL_ONLY

1. **[TC-012]** Click "Add to wishlist" on product 63's card → AJAX `POST /addproducttocart/details/63/2`, bar notification "The product has been added to your wishlist".
2. **[TC-017]** Header count confirmed `(0)` → `(1)`.
3. **[TC-005]** Navigate to Wishlist page → product card visible (name, price, Remove, Add to cart).

**Teardown:** Remove product 63 to restore S0.

---

## J-05: Add Product via Product Detail Page

**Entry State:** S0 | **Exit State:** S1 | **Parallel Safety:** 🔒 SERIAL_ONLY

1. **[TC-013]** On `/cream`, click the PDP's "Add to wishlist" button → same AJAX endpoint/message as J-04, different entry surface.

**Teardown:** Remove product 63 to restore S0.

---

## J-06: Remove Product — Header Count Decrements Back to Empty

**Entry State:** S1 (via setup add, reusing J-04's add step) | **Exit State:** S0 | **Parallel Safety:** 🔒 SERIAL_ONLY

1. *(setup)* Add product 63.
2. **[TC-018]** Click "Remove" on the product card → header count decrements by exactly 1.

---

## J-07: Multi-Item Wishlist View

**Entry State:** S0 | **Exit State:** S0 (after cleanup) | **Parallel Safety:** 🔒 SERIAL_ONLY

1. **[TC-006]** Add product 63 and `/gel-cream`, view the Wishlist page → two distinct cards, each with its own Remove action.

**Teardown:** Remove both products.

⚠️ `/gel-cream` has not been live-verified as an addable product — confirm at Stage 4 before use.

---

## J-08: Duplicate Add Attempt — ⚠️ Confirmed Discrepancy

**Entry State:** S1 | **Exit State:** S1, count over-incremented | **Parallel Safety:** 🔒 SERIAL_ONLY

1. *(setup)* Add product 63.
2. **[TC-014]** Click "Add to wishlist" again on the same, already-wishlisted product.

✅ **Confirmed live (2026-08-21), see D-011:** the POST fires again (200), the same success bar notification shows again, and the header count increments AGAIN (e.g. `(1)` → `(2)`) — but the wishlist grid still shows exactly 1 card for the product. Header count and visible-card count diverge after a repeat add. **Flagged to the product owner as an open intended-vs-bug question** — not silently resolved in test expectations.

**Teardown:** Remove product 63.

---

## J-09: Rapid Double-Click Integrity

**Entry State:** S0 | **Exit State:** S1 (exactly once) | **Parallel Safety:** 🔒 SERIAL_ONLY

1. **[TC-015]** Double-click "Add to wishlist" on product 63's PDP in rapid succession → added exactly once, not twice.

**Teardown:** Remove product 63.

---

## J-10: AJAX Network-Level Verification

**Entry State:** S0 | **Exit State:** S1 | **Parallel Safety:** 🔒 SERIAL_ONLY

1. **[TC-016]** Add product 63 while intercepting the network request → `POST /addproducttocart/details/63/2` returns 200, no full page reload.

**Teardown:** Remove product 63.

---

## J-11: Large Wishlist (20+ Items) Boundary — ✅ Resolved

**Entry State:** S0 | **Exit State:** S0 (after cleanup) | **Parallel Safety:** 🔒 SERIAL_ONLY

1. **[TC-009]** Add the 21 products listed in `testdata/wishlist-management/seed.json`'s `product-list` entry, view the Wishlist page, scroll through the full list.

✅ 21 distinct, live-verified product slugs confirmed 2026-08-21 (aggregated across `/search?q={cream,toner,mask,serum,set}`).

**Teardown:** Remove all 21 products.

---

## J-12: Discontinued/Out-of-Stock Product Rendering — ⛔ Deferred (No Fixture Exists)

**Entry State:** S1 | **Exit State:** **DEFERRED** | **Parallel Safety:** 🔒 SERIAL_ONLY

1. **[TC-008]** View the Wishlist page containing a product that has since been discontinued/gone out of stock.

⛔ **Searched live across 9 catalog terms** (cream, toner, mask, serum, set, oil, cleanser, sunscreen, lotion — 24+ distinct products checked) — zero "out of stock" text found anywhere. This staging catalog has no discontinued/out-of-stock product currently configured. Per the Live Explorer skill's Section 7a Step 5, this is recorded as "no fixture found after reasonable search" and TC-008 is **deferred**, not automated against a fabricated fixture. If the owner has a specific out-of-stock SKU in mind, provide it and this journey can proceed.

---

## Async / Interfering-UI Handlers

| Pattern | Strategy | Max Wait |
|---------|----------|----------|
| Add/Remove-to-wishlist AJAX call | `waitForAjaxComplete()` + assert bar notification text (D-010) | 15s |
| Header wishlist count refresh | Assert `span.wishlist-qty` directly after the AJAX response settles, not a fixed sleep | 5s |
| **Three overlapping popups** | `dismissAllModals()` already removes `#kdn-welcome-modal` and `#multi-popup-overlay` (confirmed by reading its source). It does NOT match `.news-letter-popup-modal`/`.ui-widget-overlay` — add those before Stage 5 relies on it (D-010 point 6) | 3s |
| Add-to-wishlist click must be trusted | Use Playwright's real `.click()` (`{force:true}` if needed to punch through a lingering overlay) — a JS-dispatched `el.click()` does **not** fire the site's handler (D-010 point 5) | n/a |

## Stage 4 Resolution Summary

1. ✅ **RESOLVED** — unauthenticated `/wishlist` redirects to `/login` (TC-002/TC-007).
2. ⚠️ **RESOLVED, ESCALATED** — re-adding an already-wishlisted product repeats the success message and over-increments the header count without duplicating the grid entry (TC-014/J-08). See `memory/decisions.md` D-011 — open question for the product owner.
3. ⛔ **DEFERRED** — no discontinued/out-of-stock product fixture exists in this catalog after a 9-term search (TC-008/J-12).
4. ✅ **RESOLVED** — 21 real product slugs confirmed for the large-wishlist boundary case (TC-009/J-11).

See `workflows/wishlist-management.verify.json`/`.verify.md` for the full Stage 4 selector/DOM verification record.
