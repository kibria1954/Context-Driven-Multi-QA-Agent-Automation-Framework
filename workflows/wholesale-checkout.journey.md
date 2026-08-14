# Automation Journeys — `wholesale-checkout`

> Generated: 2026-08-11T19:48:30.000Z
> Total: 10 journeys

---

## JOURNEY-001 — REQ-01 — Happy Path: Direct Order Confirmation Flow (Skip Payment & Address)
- **Test Cases:** TC-CHK-001
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[CartPage]** Navigate to `/cart` with items >= ৳10,000
   → Expected: Cart page loaded with valid subtotal
3. **[CartPage]** Agree to Terms of Service (`#termsofservice`)
   → Expected: Terms checkbox checked
4. **[CartPage]** Click "Proceed to Checkout →" (`#checkout`)
   → Expected: Bypasses shipping address & payment method steps
5. **[BasePage]** Wait for AJAX / navigation to complete
   → Expected: Direct arrival at Order Confirmation / Order Completed page
6. **[CheckoutPage]** Verify: Direct order confirmation page reached
   → Expected: Order is confirmed without payment or address prompt

---

## JOURNEY-002 — REQ-02 — Happy Path: Default Registration Address Used as Shipping Address
- **Test Cases:** TC-CHK-002
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
2. **[CheckoutPage]** Complete direct checkout
   → Expected: Order completed page rendered
3. **[OrderDetailsPage]** Navigate to order details (`/orderdetails/*`)
   → Expected: Order details page loaded
4. **[OrderDetailsPage]** Inspect shipping address section
   → Expected: Address matches registered business address (`/customer/addresses`)

---

## JOURNEY-003 — REQ-03 — Happy Path: Order Placed Successfully Despite Exceeded Credit Limit
- **Test Cases:** TC-CHK-003
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
2. **[CartPage]** Add items >= ৳10,000 to cart for customer with 0 remaining credit limit
   → Expected: Cart subtotal meets minimum
3. **[CartPage]** Click "Proceed to Checkout →"
   → Expected: Order processes without credit limit error block
4. **[CheckoutPage]** Verify: Order placed successfully and Order Number generated
   → Expected: Valid order number assigned

---

## JOURNEY-004 — REQ-01 — Exact Boundary: Cart Subtotal Exactly ৳10,000 Allowed
- **Test Cases:** TC-CHK-004
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
2. **[CartPage]** Populate cart with items totaling exactly ৳10,000
   → Expected: Cart subtotal equals ৳10,000
3. **[CartPage]** Click "Proceed to Checkout →"
   → Expected: Checkout proceeds smoothly

---

## JOURNEY-005 — REQ-01 — Invalid Input / Validation: Subtotal Below ৳10,000 Threshold Blocks Checkout
- **Test Cases:** TC-CHK-005
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
2. **[CartPage]** Populate cart with subtotal < ৳10,000
   → Expected: Subtotal below minimum threshold
3. **[CartPage]** Inspect checkout button / warning message
   → Expected: Minimum order warning displayed; checkout blocked

---

## JOURNEY-006 — REQ-02 — Security: Address Locking Verification During Checkout
- **Test Cases:** TC-CHK-006
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
2. **[CheckoutPage]** Inspect checkout UI during confirmation
   → Expected: No address dropdown or edit link visible

---

## JOURNEY-007 — REQ-01 — Security: Unauthenticated Guest Checkout Redirect
- **Test Cases:** TC-CHK-007
- **Verification:** pending

**Steps:**
1. **[CartPage]** Open `/cart` as unauthenticated guest
2. **[CartPage]** Click "Proceed to Checkout →"
   → Expected: System redirects to `/login?returnUrl=%2Fcart`

---

## JOURNEY-008 — REQ-03 — Edge: ERP Order Number Generation & Data Integrity
- **Test Cases:** TC-CHK-008
- **Verification:** pending

**Steps:**
1. **[CheckoutPage]** Complete wholesale order
2. **[CheckoutPage]** Extract order ID
   → Expected: Valid numeric order ID generated for ERP integration

---

## JOURNEY-009 — REQ-01 — Edge: Rapid Double-Click Checkout Handling
- **Test Cases:** TC-CHK-009
- **Verification:** pending

**Steps:**
1. **[CartPage]** Double click "Proceed to Checkout →" button rapidly (<200ms)
   → Expected: System creates only 1 order

---

## JOURNEY-010 — REQ-01 — UI: Terms of Service Agreement Unchecked Warning
- **Test Cases:** TC-CHK-010
- **Verification:** pending

**Steps:**
1. **[CartPage]** Leave `#termsofservice` unchecked and click "Proceed to Checkout →"
   → Expected: Warning notification modal displayed
