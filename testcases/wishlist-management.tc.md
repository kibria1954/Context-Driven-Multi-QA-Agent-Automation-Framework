# Test Cases — Wishlist Management

**Feature:** `wishlist-management` | **Generated:** 2026-08-21 | **Loop A Iterations:** 1 | **Total TCs:** 18

> **Stage 1/0 grounding note (applies to TC-001–TC-018):** live verification during ingestion (`memory/decisions.md` D-009, D-010) already confirmed the two navigation paths, the real add-to-wishlist button/AJAX endpoint, the verbatim success message, and the verbatim empty-state message. TC-002, TC-007, TC-008, TC-009, and TC-014 still have behavior marked "confirm at Stage 4" — those specifics were NOT verified and must not be assumed true until Stage 4 closes the loop.

---

## TC-001 — Positive: Customer navigates to Wishlist via My Account dashboard sidebar — REQ-01

- **Requirement:** REQ-01
- **Acceptance Criteria:** AC-01
- **Type:** positive
- **Layer:** UI
- **Priority:** P0
- **Tags:** smoke, regression, req-01
- **Status:** draft

**Preconditions:**
- Customer is authenticated (`tests/.auth/customer.json`).

**Steps:**
1. Navigate to `/customer/info`.
2. Click the "Wishlist" link in the dashboard sidebar.

**Expected Result:**
- **URL State:** `/wishlist` (resolves to `/korean-wishlist`).
- **DOM State:** Page heading "My account - Wishlist" is visible.
- **Data State:** No data mutation.

---

## TC-002 — Negative: Unauthenticated user directly requesting the Wishlist URL is redirected to login — REQ-01

- **Requirement:** REQ-01
- **Acceptance Criteria:** AC-01
- **Type:** negative
- **Layer:** UI
- **Priority:** P1
- **Tags:** regression, auth, req-01
- **Status:** draft

**Preconditions:**
- No auth storageState — fresh/guest browser context.

**Steps:**
1. Navigate directly to `/wishlist` without logging in.

**Expected Result:**
- **URL State:** Redirected away from Wishlist content — **exact redirect target NOT YET VERIFIED, confirm at Stage 4.**
- **DOM State:** Wishlist product list / empty-state message is NOT visible.
- **Data State:** No data mutation.

**Negative Specifics:**
- **Missing Element:** Wishlist product list / empty-state message.

---

## TC-003 — Positive: Customer navigates to Wishlist via the header navbar wishlist icon — REQ-02

- **Requirement:** REQ-02
- **Acceptance Criteria:** AC-01
- **Type:** positive
- **Layer:** UI
- **Priority:** P0
- **Tags:** smoke, regression, req-02
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- Customer is on the homepage.

**Steps:**
1. Click `a.header-link-wishlist` (the header wishlist icon).

**Expected Result:**
- **URL State:** `/wishlist` (resolves to `/korean-wishlist`).
- **DOM State:** Page heading "My account - Wishlist" is visible.
- **Data State:** No data mutation.

---

## TC-004 — Edge: Header wishlist icon navigates correctly from a non-home page — REQ-02

- **Requirement:** REQ-02
- **Acceptance Criteria:** AC-01
- **Type:** edge
- **Layer:** UI
- **Priority:** P2
- **Tags:** edge, req-02
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- Customer is on a product detail page (e.g. `/cream`).

**Steps:**
1. Click the header wishlist icon.

**Expected Result:**
- **URL State:** `/wishlist` (resolves to `/korean-wishlist`).
- **DOM State:** Page heading "My account - Wishlist" is visible.
- **Data State:** No data mutation.

---

## TC-005 — Positive: Wishlist page displays a product card with item details and a remove action — REQ-03

- **Requirement:** REQ-03
- **Acceptance Criteria:** AC-01
- **Type:** positive
- **Layer:** UI
- **Priority:** P0
- **Tags:** smoke, regression, req-03
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- Product id `63` ("Cream", see `testdata/wishlist-management/seed.json`) added to the wishlist as setup.

**Steps:**
1. Navigate to the Wishlist page.

**Expected Result:**
- **URL State:** `/wishlist` (resolves to `/korean-wishlist`).
- **DOM State:** One product card visible showing name "Cream — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance", price "$33.00", a "Remove" button, and an "Add to cart" button.
- **Data State:** Wishlist contains exactly 1 item.

---

## TC-006 — Positive: Wishlist page displays one card per saved product for multiple items — REQ-03

- **Requirement:** REQ-03
- **Acceptance Criteria:** AC-01
- **Type:** positive
- **Layer:** UI
- **Priority:** P1
- **Tags:** regression, req-03
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- Two products (id `63` "Cream" and `/gel-cream`) added to the wishlist as setup.

**Steps:**
1. Navigate to the Wishlist page.

**Expected Result:**
- **URL State:** `/wishlist` (resolves to `/korean-wishlist`).
- **DOM State:** Two distinct product cards visible, one per product, each with its own Remove action.
- **Data State:** Wishlist contains exactly 2 items.

---

## TC-007 — Negative: Unauthenticated user cannot view populated Wishlist content directly via URL — REQ-03

- **Requirement:** REQ-03
- **Acceptance Criteria:** AC-01
- **Type:** negative
- **Layer:** UI
- **Priority:** P0
- **Tags:** regression, auth, req-03
- **Status:** draft

**Preconditions:**
- No auth storageState — fresh/guest browser context.

**Steps:**
1. Navigate directly to `/wishlist` without logging in.

**Expected Result:**
- **URL State:** Redirected away from wishlist content — **confirm exact target at Stage 4.**
- **DOM State:** No product cards or wishlist content visible.
- **Data State:** No data mutation.

**Negative Specifics:**
- **Missing Element:** Product card(s).

---

## TC-008 — Edge: A discontinued/out-of-stock product in the wishlist renders without breaking the page — REQ-03

- **Requirement:** REQ-03
- **Acceptance Criteria:** AC-01
- **Type:** edge
- **Layer:** UI
- **Priority:** P2
- **Tags:** edge, req-03
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- A wishlist item exists whose product has since been discontinued/gone out of stock — **fixture NOT YET IDENTIFIED, confirm at Stage 4.**

**Steps:**
1. Navigate to the Wishlist page.

**Expected Result:**
- **URL State:** `/wishlist` (resolves to `/korean-wishlist`).
- **DOM State:** Page renders without crashing/blank screen; exact handling (out-of-stock indicator vs. graceful omission) **NOT YET VERIFIED — confirm at Stage 4.**
- **Data State:** No data mutation.

---

## TC-009 — Boundary/Edge: Wishlist with a large number of items (20+) renders without breaking layout — REQ-03

- **Requirement:** REQ-03
- **Acceptance Criteria:** AC-01
- **Type:** boundary
- **Layer:** UI
- **Priority:** P2
- **Tags:** boundary, edge, req-03
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- 20+ products added to the wishlist as setup.

**Steps:**
1. Navigate to the Wishlist page.
2. Scroll through the full list.

**Expected Result:**
- **URL State:** `/wishlist` (resolves to `/korean-wishlist`).
- **DOM State:** All items render (paginated or scrollable, per actual site behavior) without layout breakage.
- **Data State:** Wishlist contains exactly 20+ items.

---

## TC-010 — Positive: Empty wishlist displays "Your wishlist is empty." and a working "Browse products →" button — REQ-04

- **Requirement:** REQ-04
- **Acceptance Criteria:** AC-02
- **Type:** positive
- **Layer:** UI
- **Priority:** P0
- **Tags:** smoke, regression, req-04
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- Wishlist has zero items (default state of the shared test account, `testdata/wishlist-management/seed.json`).

**Steps:**
1. Navigate to the Wishlist page.

**Expected Result:**
- **URL State:** `/wishlist` (resolves to `/korean-wishlist`).
- **DOM State:** Text "Your wishlist is empty." is visible; a "Browse products" button/link is visible.
- **Data State:** Wishlist contains 0 items.

---

## TC-011 — Edge: "Browse products →" button navigates to the home page — REQ-04

- **Requirement:** REQ-04
- **Acceptance Criteria:** AC-02
- **Type:** edge
- **Layer:** UI
- **Priority:** P2
- **Tags:** edge, req-04
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- Wishlist is empty.

**Steps:**
1. Navigate to the Wishlist page.
2. Click the "Browse products →" button.

**Expected Result:**
- **URL State:** Home page (`/`).
- **DOM State:** Home page content is visible.
- **Data State:** No data mutation.

---

## TC-012 — Positive: Clicking "♡ Wishlist" on a product card adds the product with a success message — REQ-05

- **Requirement:** REQ-05
- **Acceptance Criteria:** AC-03
- **Type:** positive
- **Layer:** UI
- **Priority:** P0
- **Tags:** smoke, regression, req-05
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- Product id `63` ("Cream") is not currently in the wishlist.
- Customer is on a page showing the product card (e.g. `/search?q=cream`).

**Steps:**
1. Click the "Add to wishlist" button on the product card (`#add-to-wishlist-button-63`).

**Expected Result:**
- **URL State:** No navigation (AJAX, stays on current page).
- **DOM State:** Bar notification reads "The product has been added to your wishlist" (verbatim — see `memory/decisions.md` D-010).
- **Data State:** Product 63 is now present in the customer's wishlist.

---

## TC-013 — Positive: Clicking "♡ Wishlist" on the product detail page adds the product with a success message — REQ-05

- **Requirement:** REQ-05
- **Acceptance Criteria:** AC-03
- **Type:** positive
- **Layer:** UI
- **Priority:** P1
- **Tags:** regression, req-05
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- Product id `63` ("Cream") is not currently in the wishlist.
- Customer is on `/cream` (product detail page).

**Steps:**
1. Click the "Add to wishlist" button on the product detail page.

**Expected Result:**
- **URL State:** No navigation (AJAX, stays on `/cream`).
- **DOM State:** Bar notification reads "The product has been added to your wishlist".
- **Data State:** Product 63 is now present in the customer's wishlist.

---

## TC-014 — Confirmed: Re-adding an already-wishlisted product repeats the success message and increments the header count, but does NOT duplicate the grid entry — REQ-05

- **Requirement:** REQ-05
- **Acceptance Criteria:** AC-03
- **Type:** edge
- **Layer:** UI
- **Priority:** P1
- **Tags:** regression, req-05, flagged-discrepancy
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- Product id `63` ("Cream") is already in the wishlist.

**Steps:**
1. Click the "Add to wishlist" button on the same product again.

**Expected Result:**
- **URL State:** No navigation.
- **DOM State:** Bar notification reads "The product has been added to your wishlist" again (same text as the first add) — see `memory/decisions.md` D-011.
- **Data State:** The wishlist grid (`/korean-wishlist`) still shows exactly 1 product card for product 63 (confirmed: 1 `button.wishlist-remove-btn`, not 2). **The header `span.wishlist-qty` count DOES increment again** (e.g. `(1)` → `(2)`), which no longer matches the actual visible-card count (1).

**⚠️ Confirmed Discrepancy (D-011):** this is a genuine observed behavior, flagged to the product owner as an open question (intended vs. bug) — not a guess, and not silently patched away. Do not assert `header count == visible card count` as a general invariant for this feature; it only holds for a first-time add (see TC-017).

---

## TC-015 — Edge: Rapid double-click on "Add to wishlist" does not create a duplicate entry — REQ-05

- **Requirement:** REQ-05
- **Acceptance Criteria:** AC-03
- **Type:** edge
- **Layer:** UI
- **Priority:** P1
- **Tags:** edge, regression, req-05
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- Product id `63` ("Cream") is not currently in the wishlist.

**Steps:**
1. Double-click the "Add to wishlist" button on the product detail page in rapid succession.

**Expected Result:**
- **URL State:** No navigation.
- **DOM State:** Success notification shown once (not duplicated).
- **Data State:** Wishlist contains exactly 1 entry for product 63, not 2.

---

## TC-016 — UI+API: Add-to-wishlist AJAX request returns 200 and reflects in the DOM without a full page reload — REQ-05

- **Requirement:** REQ-05
- **Acceptance Criteria:** AC-03
- **Type:** positive
- **Layer:** UI+API
- **Priority:** P2
- **Tags:** regression, api, req-05
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- Product id `63` ("Cream") is not currently in the wishlist.

**Steps:**
1. Click the "Add to wishlist" button.
2. Observe the network request fired.

**Expected Result:**
- **URL State:** No navigation.
- **DOM State:** Header wishlist count and bar notification update in place.
- **Data State:** `POST /addproducttocart/details/63/2` returns HTTP 200 (see D-010).

---

## TC-017 — Positive: Header wishlist count increments by 1 immediately after adding a NEW product not previously in the wishlist — REQ-06

- **Requirement:** REQ-06
- **Acceptance Criteria:** AC-03
- **Type:** positive
- **Layer:** UI
- **Priority:** P0
- **Tags:** smoke, regression, req-06
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- Header wishlist count is known before the action (e.g. `(0)`).
- The product being added is NOT already in the wishlist (see D-011 for the repeat-add case, covered by TC-014).

**Steps:**
1. Note the header wishlist count.
2. Add a product to the wishlist.
3. Re-check the header wishlist count.

**Expected Result:**
- **URL State:** No navigation.
- **DOM State:** `span.wishlist-qty` inside `a.header-link-wishlist` increments by exactly 1 (e.g. `(0)` → `(1)`).
- **Data State:** Wishlist item count matches the displayed header count for this first-add case. **This equivalence does NOT hold after a repeat add of the same product — see D-011.**

---

## TC-018 — Edge: Header wishlist count decrements by 1 immediately after removing an item — REQ-06

- **Requirement:** REQ-06
- **Acceptance Criteria:** AC-03
- **Type:** edge
- **Layer:** UI
- **Priority:** P1
- **Tags:** edge, regression, req-06
- **Status:** draft

**Preconditions:**
- Customer is authenticated.
- At least 1 product is in the wishlist.

**Steps:**
1. Note the header wishlist count.
2. Click "Remove" on a product card on the Wishlist page.
3. Re-check the header wishlist count.

**Expected Result:**
- **URL State:** No navigation.
- **DOM State:** `span.wishlist-qty` inside `a.header-link-wishlist` decrements by exactly 1.
- **Data State:** Wishlist item count matches the displayed header count.
