# User Journeys — `wishlist-management`

## J-WISH-01: End-to-End Wishlist Lifecycle (Add ➔ View ➔ Empty State Navigation)

- **State 0**: Unauthenticated / Guest Visitor
- **State 1**: Wholesale Customer Authenticated (`userKBD@gmail.com`)
- **State 2**: Product Added to Wishlist (`TC-WISH-001`)
- **State 3**: Wishlist Page Inspected via Navbar / Dashboard Sidebar (`TC-WISH-002`)
- **State 4**: Items Cleared ➔ Empty State & Home Navigation (`TC-WISH-003`)

---

## Journey Sequence

1. **Login & Session Preparation**:
   - Customer logs in with `userKBD@gmail.com` / `0123456789`.
2. **Product Catalog & PDP Wishlist Action**:
   - Navigate to catalog page (`/`) or product detail page.
   - Click "♡ Wishlist" button.
   - Assert notification bar text: `"The product has been added to your wishlist"`.
3. **Wishlist View & Verification**:
   - Click header Wishlist link or navigate to `/wishlist`.
   - Assert product title, price, and remove checkbox/button are visible.
4. **Empty State Validation**:
   - Remove items from wishlist table and update wishlist.
   - Assert empty state message (`"Your wishlist is empty."` / `"The wishlist is empty!"`).
   - Click `"Browse products →"` link and verify navigation to home page (`/`).
