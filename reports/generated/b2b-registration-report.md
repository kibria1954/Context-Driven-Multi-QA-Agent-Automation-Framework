# 📊 Executive Test Report — `b2b-registration`

- **Story**: `b2b-registration`
- **Pass Rate**: **0%**
- **Total Tests**: 30 | ✅ Passed: 0 | ❌ Failed: 0 | ⏭️ Skipped: 30
- **Report Generated**: `8/27/2026, 12:01:03 PM`

---

## 📋 Test Execution Table

| TC-ID | Scenario Name | Browser | Type | Status | Duration | REQ-ID | Failure Reason |
|---|---|---|---|---|---|---|---|
| `TC-001` | Successful B2B registration creates inactive account, mapped to ERP application | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-01` | — |
| `TC-002` | Valid submission with alternate Type of Business and Contact Media combination | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-01` | — |
| `TC-003` | Missing required field (Company Name) blocks submission — no entity created | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-01` | — |
| `TC-004` | Rapid double-click on Submit does not create duplicate entities | `storefront-guest` | `negative` | ⏭️ SKIPPED | 0.0s | `REQ-01` | — |
| `TC-005` | All Company Info fields accepted across different Type of Business options | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-02` | — |
| `TC-006` | Empty Company Name blocks submission with validation error | `storefront-guest` | `edge` | ⏭️ SKIPPED | 0.0s | `REQ-02` | — |
| `TC-007` | Invalid email format blocks submission with validation error | `storefront-guest` | `negative` | ⏭️ SKIPPED | 0.0s | `REQ-02` | — |
| `TC-008` | BD phone number — 11-digit accepted, 10-digit and 12-digit rejected | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-02` | — |
| `TC-009` | Special characters and Unicode in Company Name handled without breaking the form | `storefront-guest` | `edge` | ⏭️ SKIPPED | 0.0s | `REQ-02` | — |
| `TC-010` | Zip Code empty vs whitespace-only input — consistent handling | `storefront-guest` | `edge` | ⏭️ SKIPPED | 0.0s | `REQ-02` | — |
| `TC-011` | Selecting WhatsApp reveals required WhatsApp Number field, Messenger fields hidden | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-03` | — |
| `TC-012` | Selecting Messenger reveals required Messenger fields, WhatsApp field hidden | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-03` | — |
| `TC-013` | Toggling Contact Media from WhatsApp to Messenger clears/hides the WhatsApp Number field | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-03` | — |
| `TC-014` | WhatsApp selected but WhatsApp Number left blank blocks submission | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-03` | — |
| `TC-015` | Valid Username, Password, Confirm Password, dropdown, and business textarea accepted | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-04` | — |
| `TC-016` | Password and Confirm Password mismatch blocks submission | `storefront-guest` | `negative` | ⏭️ SKIPPED | 0.0s | `REQ-04` | — |
| `TC-017` | Empty Password field blocks submission | `storefront-guest` | `edge` | ⏭️ SKIPPED | 0.0s | `REQ-04` | — |
| `TC-018` | Username containing special characters or spaces | `storefront-guest` | `edge` | ⏭️ SKIPPED | 0.0s | `REQ-04` | — |
| `TC-019` | All 3 required checkboxes checked allows submission — Wholesale Agreement is display text, not a checkbox | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-05` | — |
| `TC-020` | Terms of Service unchecked blocks submission | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-05` | — |
| `TC-021` | Only the 18+ Age confirmation unchecked blocks submission with specific error | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-05` | — |
| `TC-022` | Brand-new unique email and username pass the uniqueness check | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-06` | — |
| `TC-023` | Duplicate email (already-registered wholesale account) blocks submission with clear error | `storefront-guest` | `negative` | ⏭️ SKIPPED | 0.0s | `REQ-06` | — |
| `TC-024` | Duplicate username blocks submission with clear error | `storefront-guest` | `negative` | ⏭️ SKIPPED | 0.0s | `REQ-06` | — |
| `TC-025` | Case-variant duplicate email blocks submission | `storefront-guest` | `negative` | ⏭️ SKIPPED | 0.0s | `REQ-06` | — |
| `TC-026` | Admin sees full submitted wholesale data in Advanced B2B/B2C > Registration Applications | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-07` | — |
| `TC-027` | Registration Applications list correctly handles no matching application, no crash | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-07` | — |
| `TC-028` | Admin activates account via Active flag + save — login enabled | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-08` | — |
| `TC-029` | Login attempt before admin approval is blocked with inactive-account message | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-08` | — |
| `TC-030` | Admin deactivates a previously-active account — login blocked again | `storefront-guest` | `positive` | ⏭️ SKIPPED | 0.0s | `REQ-08` | — |
