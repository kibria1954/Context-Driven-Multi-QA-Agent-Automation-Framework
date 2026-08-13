# Feature Requirement: Wholesale Direct Checkout & Credit Limit Bypass (`wholesale-checkout`)

## Overview
As a wholesale customer, I want to place orders without any online payment step or shipping address selection so that I can quickly confirm my wholesale orders and have them processed using my registered business address.

## Test Account Credentials & Access Points
- **Wholesale Customer Email**: `userKBD@gmail.com`
- **Wholesale Customer Password**: `0123456789`
- **Access Points**: Shopping Cart (`/cart`), Direct Checkout (`/onepagecheckout` / `/checkout/completed`)

---

## Acceptance Criteria

### REQ-01: Direct Order Confirmation Flow (Skip Payment & Address)
- **Given** the customer has items in the cart meeting the ৳10,000 minimum threshold
- **When** the customer clicks "Proceed to Checkout →" (`button.checkout-button` / `#checkout`)
- **Then** the system should skip the payment method selection step
- **And** skip the shipping address entry step
- **And** navigate directly to the Order Confirmation page (`/checkout/completed` or `/orderdetails/*`).

### REQ-02: Default Registration Address Used as Shipping Address
- **Given** the customer is completing the checkout
- **When** the order is placed
- **Then** the order should use the customer's default registration address as the shipping address
- **And** no option to change the address should be presented during checkout.

### REQ-03: Order Placed Regardless of Credit Limit (ERP Sync)
- **Given** the customer has exceeded their credit limit
- **When** the customer attempts to place an order
- **Then** the system should allow the order to go through
- **And** the order should be created in the ERP system with a valid order number.
