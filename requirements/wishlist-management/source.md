As a wholesale customer
I want to save products to my wishlist and manage them from my account
So that I can keep track of products I intend to order in the future



Acceptance Criteria

Scenario: View Wishlist

Given the customer navigates to "Wish List" in the dashboard sidebar
When the page loads
Then saved product cards should be displayed with item details and a remove action



Scenario: Empty Wishlist State

Given the customer has no products in their wishlist
When the Wish List page loads
Then a message "Your wishlist is empty." should be displayed
And a "Browse products →" button should link to the home page



Scenario: Add Product to Wishlist

Given the customer is on a product card or product detail page
When the customer clicks the "♡ Wishlist" button
Then the product should be added to the wishlist with proper success message
And the wishlist count in the header should update

Note: Wishlist is reachable via two separate navigation paths — (1) User > My Account > Wishlist in the dashboard sidebar, and (2) the wishlist icon in the site header navbar (with an item-count badge). Both paths must be covered. Verified live on staging 2026-08-21 — both resolve to the same page (`/wishlist` → `/korean-wishlist`); see memory/decisions.md D-009.
