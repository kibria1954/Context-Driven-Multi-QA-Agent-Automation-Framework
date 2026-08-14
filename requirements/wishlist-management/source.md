# Feature Requirement: Wishlist Management (`wishlist-management`)

## Overview
As a wholesale customer, I want to save products to my wishlist and manage them from my account so that I can keep track of products I intend to order in the future.

## Test Account Credentials
- **Email**: `userKBD@gmail.com`
- **Password**: `0123456789`

## Wishlist Access Points
- **Navbar Wishlist Icon**: Visible in header navigation bar (`.header-links .wishlist-label`)
- **My Account Sidebar**: Accessible via `My Account` ➔ `Wish List` (`/customer/wishlist` or `/wishlist`)

---

## Acceptance Criteria

### REQ-01: View Wishlist Items
- **Given** the customer navigates to "Wish List" in the dashboard sidebar or navbar wishlist icon
- **When** the page loads
- **Then** saved product cards should be displayed with item details and a remove action (`input[name="removefromcart"]` or remove button).

### REQ-02: Empty Wishlist State
- **Given** the customer has no products in their wishlist
- **When** the Wish List page loads
- **Then** a message "Your wishlist is empty." or "The wishlist is empty!" should be displayed
- **And** a "Browse products →" button or link should direct to the home page (`/`).

### REQ-03: Add Product to Wishlist
- **Given** the customer is on a product card or product detail page (PDP)
- **When** the customer clicks the "♡ Wishlist" button (`button.add-to-wishlist-button` or `.product-box .wishlist-button`)
- **Then** the product should be added to the wishlist with a proper bar notification success message ("The product has been added to your wishlist")
- **And** the wishlist item count indicator in header should update.
