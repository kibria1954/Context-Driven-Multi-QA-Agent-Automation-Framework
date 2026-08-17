# Test Scenarios — B2B Wholesale Registration (Stakeholder Review)

## What We're Testing

A new wholesale buyer signing up for a B2B account — filling out the registration form, the system creating the right backend records automatically, an admin reviewing and approving the application, and the buyer being able to log in once approved.

## Scenarios

### ✅ Happy Path Scenarios
1. **Complete, valid registration** — A buyer fills out every section of the form correctly and submits. ✅ Expected: an ERP account, a shipping address record, and a pending customer account are all created automatically, and the buyer sees a "your application is under review" confirmation.
2. **Different valid business types** — The same flow works regardless of which business type or preferred contact method (WhatsApp vs Messenger) the buyer picks.
3. **Contact method fields adapt correctly** — Choosing WhatsApp shows the WhatsApp number field; choosing Messenger shows the Messenger fields instead.
4. **Admin sees the full application** — Once submitted, an admin can open the buyer's profile and see every detail they submitted in one dedicated section.
5. **Admin approval activates the account** — When an admin approves the application, the buyer can immediately log in and use their wholesale account, and they get a welcome email.

### ❌ Error Handling Scenarios
6. **Missing required information** — If any required field is left blank, the system blocks submission and clearly tells the buyer what's missing. ❌ Expected: no partial or broken records get created.
7. **Already-used email or username** — If someone tries to register with an email or username that's already taken, the system blocks it with a clear message instead of silently failing or creating a duplicate account.
8. **Password mismatch** — If the two password fields don't match, submission is blocked.
9. **Missing agreements** — The buyer must accept all required agreements (including confirming they're 18+) before they can submit.
10. **Trying to log in before approval** — A buyer can't log in until an admin has approved their application.

### 🔲 Edge Cases
11. **Double-clicking submit** — Clicking "Create Account" twice quickly shouldn't create two accounts.
12. **Switching contact method mid-form** — If a buyer picks WhatsApp, types a number, then switches to Messenger, the old WhatsApp number shouldn't accidentally get submitted.
13. **Unusual characters in company names** — Company names with special characters or non-English text should be handled safely without breaking the form.
14. **Admin can deactivate an account** — An admin can also turn an active account back off, and that immediately blocks the customer's login again.

---

**Numbers:** 8 requirements identified, 30 test scenarios designed (positive, negative, edge, and boundary cases for each).
