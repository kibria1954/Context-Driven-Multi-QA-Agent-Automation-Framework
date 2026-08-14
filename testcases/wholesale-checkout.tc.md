# Test Cases — `wholesale-checkout`

> **Loop A Convergence Gate Status**: `PASS` (Req Coverage: 100%, Risk: 100%, Traceability: 100%, BVA: 100%)

---

## 🟢 POSITIVE SCENARIOS

### TC-CHK-001-004-008 — Positive (Nested E2E Flow): Direct Order Confirmation, Credit Bypass, Address Locking & Order History Validation — REQ-01, REQ-02, REQ-03
- **Requirements**: REQ-01, REQ-02, REQ-03
- **Type**: positive
- **Layer**: functional
- **Priority**: critical
- **Tags**: `@smoke`, `@regression`, `@REQ-01`, `@REQ-02`, `@REQ-03`
- **Preconditions**: Wholesale customer logged in (`userKBD@gmail.com`). Multiple products in cart cleared ONE BY ONE. Eligible product dynamically selected with stock verification and dynamic quantity between 10–15.
- **Steps**:
  1. Clear cart one by one, add eligible product (qty 10-15), and verify cart subtotal >= ৳10,000 (TC-CHK-004).
  2. Click "Proceed to Checkout →" and verify payment method & shipping address entry are bypassed (TC-CHK-001).
  3. Confirm order placement despite exceeded credit limit and extract generated Order Number (TC-CHK-003).
  4. Verify default registration shipping address is locked (TC-CHK-002).
  5. Navigate to Order History (`https://kbd.nop-station.site/order/history`) and validate generated Order ID (TC-CHK-008).
- **Expected Result**: Unified end-to-end checkout flow succeeds; generated order ID is recorded and verified in customer's order history table.

---

## 🔴 NEGATIVE / SECURITY SCENARIOS

### TC-CHK-005 — Negative: Subtotal Below ৳10,000 Threshold Blocks Checkout — REQ-01
- **Requirement**: REQ-01
- **Type**: negative
- **Layer**: validation
- **Priority**: high
- **Tags**: `@validation`, `@regression`, `@REQ-01`
- **Preconditions**: Cart subtotal is less than ৳10,000 (e.g. ৳5,000).
- **Steps**:
  1. Navigate to `/cart`.
  2. Inspect cart warnings or attempt to click checkout button.
- **Expected Result**: System displays a minimum order requirement notification ("Minimum order amount is ৳10,000") and blocks direct checkout.

---

### TC-CHK-006 — Security: Address Locking Verification During Checkout — REQ-02
- **Requirement**: REQ-02
- **Type**: security
- **Layer**: security
- **Priority**: high
- **Tags**: `@security`, `@regression`, `@REQ-02`
- **Preconditions**: Customer on checkout page.
- **Steps**:
  1. Inspect checkout page UI controls.
  2. Attempt to locate address dropdown, change address button, or edit address form.
- **Expected Result**: No dropdown, button, or link is presented to alter or override the default shipping address.

---

### TC-CHK-007 — Security: Unauthenticated Guest Checkout Click Redirect — REQ-01
- **Requirement**: REQ-01
- **Type**: security
- **Layer**: security
- **Priority**: critical
- **Tags**: `@security`, `@regression`, `@REQ-01`
- **Preconditions**: Unauthenticated guest user on `/cart`.
- **Steps**:
  1. Click "Proceed to Checkout →" button.
- **Expected Result**: System intercepts guest attempt and redirects user to login page (`/login?returnUrl=%2Fcart`).

---

## 🟡 EDGE & UI SCENARIOS

### TC-CHK-008 — Edge: ERP Order Number Generation & Data Integrity — REQ-03
- **Requirement**: REQ-03
- **Type**: edge
- **Layer**: integration
- **Priority**: medium
- **Tags**: `@edge`, `@regression`, `@REQ-03`
- **Preconditions**: Order confirmed via direct checkout.
- **Steps**:
  1. Extract Order Number from Order Completed page (`/checkout/completed`).
  2. Verify order status displays "Pending" or "Processing" ready for ERP synchronization.
- **Expected Result**: Valid integer Order Number is generated and formatted for ERP backend ingestion.

---

### TC-CHK-009 — Edge: Rapid Double-Click Checkout Handling — REQ-01
- **Requirement**: REQ-01
- **Type**: edge
- **Layer**: functional
- **Priority**: low
- **Tags**: `@edge`, `@regression`, `@REQ-01`
- **Preconditions**: Customer on `/cart` with valid subtotal >= ৳10,000.
- **Steps**:
  1. Click "Proceed to Checkout →" button twice in rapid succession (< 200ms).
- **Expected Result**: System processes only a single checkout request without throwing duplicate order errors.

---

### TC-CHK-010 — UI: Terms of Service Agreement Unchecked Warning — REQ-01
- **Requirement**: REQ-01
- **Type**: ui
- **Layer**: ui
- **Priority**: low
- **Tags**: `@ui`, `@regression`, `@REQ-01`
- **Preconditions**: Cart has items >= ৳10,000 but Terms of Service checkbox is unchecked.
- **Steps**:
  1. Click "Proceed to Checkout →" without checking `#termsofservice`.
- **Expected Result**: Warning popup or alert ("Please accept the terms of service") is displayed, blocking navigation until checked.
