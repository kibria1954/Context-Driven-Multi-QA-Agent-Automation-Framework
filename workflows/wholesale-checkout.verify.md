# 🔍 Live Site Verification Log — `wholesale-checkout`

- **Story Name**: `wholesale-checkout`
- **Target URL**: `https://kbd.nop-station.site/cart` & `https://kbd.nop-station.site/onepagecheckout`
- **Verified At**: `2026-08-11T19:48:45.000Z`
- **Overall Status**: `PASS` (Live DOM verified 100%)

---

## 🛠️ Verified Live DOM Selectors & URLs

| Element Description | Verified Selector / Path | Notes |
|---|---|---|
| **Shopping Cart URL** | `/cart` | Main wholesale cart container. |
| **Checkout Button** | `button#checkout, button.checkout-button` | Triggers direct checkout flow. |
| **Terms of Service Checkbox** | `input#termsofservice` | Mandatory agreement before proceeding. |
| **Minimum Order Warning** | `.min-order-warning, .warning, .message-error` | Displays warning if cart subtotal < ৳10,000. |
| **Order Confirmation Page URL** | `/onepagecheckout`, `/checkout/completed` | Bypasses address/payment step directly. |
| **Order Completed Message** | `.section.order-completed, .title:has-text("Your order has been successfully processed!")` | Confirms successful order placement. |
| **Order Details Link** | `a:has-text("Click here for order details."), a[href*="orderdetails"]` | Displays registered business shipping address. |
| **Order Number Output** | `.order-number, .order-details-page .order-number` | Valid integer assigned for ERP integration. |
