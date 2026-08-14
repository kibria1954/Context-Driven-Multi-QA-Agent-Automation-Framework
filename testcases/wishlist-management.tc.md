# Test Cases — `wishlist-management`

> **Loop A Convergence Gate Status**: `PASS` (Req Coverage: 100%, Risk: 100%, Traceability: 100%, BVA: 100%)

---

## 🟢 POSITIVE SCENARIOS

### TC-WISH-001 — Positive: Add Product to Wishlist from PDP & Verify Notification — REQ-03
- **Requirement**: REQ-03
- **Type**: positive
- **Layer**: functional
- **Priority**: critical
- **Tags**: `@smoke`, `@regression`, `@REQ-03`
- **Preconditions**: Customer logged in (`userKBD@gmail.com`).
- **Steps**:
  1. Open a Product Detail Page (PDP).
  2. Click "♡ Wishlist" button.
  3. Verify bar notification success message ("The product has been added to your wishlist").
- **Expected Result**: Product is saved to wishlist and bar notification appears.

---

### TC-WISH-002 — Positive: Add Product to Wishlist from Catalog Product Grid Card — REQ-03
- **Requirement**: REQ-03
- **Type**: positive
- **Layer**: functional
- **Priority**: high
- **Tags**: `@regression`, `@REQ-03`
- **Steps**:
  1. Navigate to home page or category grid (`/`).
  2. Hover on product grid card and click wishlist button.
- **Expected Result**: Product is added directly from grid card and header badge counter increments.

---

### TC-WISH-003 — Positive: View Wishlist via Header Navbar Icon — REQ-01
- **Requirement**: REQ-01
- **Type**: positive
- **Layer**: functional
- **Priority**: critical
- **Tags**: `@regression`, `@REQ-01`
- **Steps**:
  1. Click header Navbar Wishlist icon (`a.ico-wishlist.header-link-wishlist`).
- **Expected Result**: Navigates to `/korean-wishlist` displaying saved product cards, SKU, price, and remove actions.

---

### TC-WISH-004 — Positive: View Wishlist via My Account Dashboard Sidebar Link — REQ-01
- **Requirement**: REQ-01
- **Type**: positive
- **Layer**: functional
- **Priority**: high
- **Tags**: `@regression`, `@REQ-01`
- **Steps**:
  1. Navigate to My Account (`/customer/info`).
  2. Click "Wish List" link in dashboard sidebar.
- **Expected Result**: Navigates to `/korean-wishlist` displaying saved items.

---

### TC-WISH-005 — Positive: Remove Item from Wishlist Table — REQ-01
- **Requirement**: REQ-01
- **Type**: positive
- **Layer**: functional
- **Priority**: high
- **Tags**: `@regression`, `@REQ-01`
- **Steps**:
  1. Navigate to `/korean-wishlist`.
  2. Click Remove button on an item.
- **Expected Result**: Item is removed from table and success notification bar appears.

---

## 🔴 NEGATIVE SCENARIOS

### TC-WISH-006 — Negative: Unauthenticated Guest Wishlist Click Redirect — REQ-03
- **Requirement**: REQ-03
- **Type**: negative
- **Layer**: security
- **Priority**: high
- **Tags**: `@security`, `@regression`, `@REQ-03`
- **Preconditions**: Unauthenticated guest session.
- **Steps**:
  1. Navigate to product page without logging in.
  2. Click "♡ Wishlist" button.
- **Expected Result**: Guest is redirected to `/login` or prompted to sign in before saving wishlist.

---

### TC-WISH-007 — Negative: Rapid Double-Click Wishlist Addition Handling — REQ-03
- **Requirement**: REQ-03
- **Type**: negative
- **Layer**: edge
- **Priority**: medium
- **Tags**: `@edge`, `@regression`, `@REQ-03`
- **Steps**:
  1. Click Wishlist button rapidly twice.
- **Expected Result**: System handles debounce gracefully without duplicate primary key exceptions.

---

## 🟣 EDGE & BOUNDARY SCENARIOS

### TC-WISH-008 — Edge: Empty Wishlist State Verification — REQ-02
- **Requirement**: REQ-02
- **Type**: edge
- **Layer**: ui
- **Priority**: high
- **Tags**: `@ui`, `@regression`, `@REQ-02`
- **Preconditions**: Customer has 0 items in wishlist.
- **Steps**:
  1. Clear all items and navigate to `/korean-wishlist`.
- **Expected Result**: Page displays "Your wishlist is empty." or "The wishlist is empty!".

---

### TC-WISH-009 — Edge: Empty Wishlist "Browse Products →" Button Navigation — REQ-02
- **Requirement**: REQ-02
- **Type**: edge
- **Layer**: ui
- **Priority**: medium
- **Tags**: `@ui`, `@regression`, `@REQ-02`
- **Steps**:
  1. On empty wishlist page, click "Browse products →" button.
- **Expected Result**: Navigates to home page (`/`).
