# 📊 Executive Test Report — `b2b-registration`

- **Story**: `b2b-registration`
- **Pass Rate**: **77%**
- **Total Tests**: 30 | ✅ Passed: 23 | ❌ Failed: 7 | ⏭️ Skipped: 0
- **Report Generated**: `8/17/2026, 4:19:06 PM`

---

## 📋 Test Execution Table

| TC-ID | Scenario Name | Type | Status | Duration | REQ-ID |
|---|---|---|---|---|---|
| `TC-001` | TC-001: Successful B2B registration creates inactive account, mapped to ERP application @REQ-01 | `positive` | **FAILED** | 31.1s | `REQ-01` |
| `TC-002` | TC-002: Valid submission with alternate Type of Business and Contact Media combination @REQ-01 | `positive` | **PASSED** | 16.9s | `REQ-01` |
| `TC-003` | TC-003: Missing required field (Company Name) blocks submission — no entity created @REQ-01 | `positive` | **FAILED** | 31.6s | `REQ-01` |
| `TC-004` | TC-004: Rapid double-click on Submit does not create duplicate entities @REQ-01 | `negative` | **FAILED** | 26.6s | `REQ-01` |
| `TC-005` | TC-005: All Company Info fields accepted across different Type of Business options @REQ-02 | `positive` | **PASSED** | 21.5s | `REQ-02` |
| `TC-006` | TC-006: Empty Company Name blocks submission with validation error @REQ-02 | `edge` | **PASSED** | 23.0s | `REQ-02` |
| `TC-007` | TC-007: Invalid email format blocks submission with validation error @REQ-02 | `negative` | **PASSED** | 8.8s | `REQ-02` |
| `TC-008` | TC-008: BD phone number — 11-digit accepted, 10-digit and 12-digit rejected @REQ-02 | `positive` | **PASSED** | 20.3s | `REQ-02` |
| `TC-009` | TC-009: Special characters and Unicode in Company Name handled without breaking the form @REQ-02 | `edge` | **PASSED** | 8.1s | `REQ-02` |
| `TC-010` | TC-010: Zip Code empty vs whitespace-only input — consistent handling @REQ-02 | `edge` | **PASSED** | 14.2s | `REQ-02` |
| `TC-011` | TC-011: Selecting WhatsApp reveals required WhatsApp Number field, Messenger fields hidden @REQ-03 | `positive` | **PASSED** | 4.7s | `REQ-03` |
| `TC-012` | TC-012: Selecting Messenger reveals required Messenger fields, WhatsApp field hidden @REQ-03 | `positive` | **PASSED** | 6.1s | `REQ-03` |
| `TC-013` | TC-013: Toggling Contact Media from WhatsApp to Messenger clears/hides the WhatsApp Number field @REQ-03 | `positive` | **PASSED** | 4.9s | `REQ-03` |
| `TC-014` | TC-014: WhatsApp selected but WhatsApp Number left blank blocks submission @REQ-03 | `positive` | **PASSED** | 8.2s | `REQ-03` |
| `TC-015` | TC-015: Valid Username, Password, Confirm Password, dropdown, and business textarea accepted @REQ-04 | `positive` | **PASSED** | 11.1s | `REQ-04` |
| `TC-016` | TC-016: Password and Confirm Password mismatch blocks submission @REQ-04 | `negative` | **PASSED** | 11.6s | `REQ-04` |
| `TC-017` | TC-017: Empty Password field blocks submission @REQ-04 | `edge` | **PASSED** | 10.9s | `REQ-04` |
| `TC-018` | TC-018: Username containing special characters or spaces @REQ-04 | `edge` | **PASSED** | 11.7s | `REQ-04` |
| `TC-019` | TC-019: All 3 required checkboxes checked allows submission — Wholesale Agreement is display text, not a checkbox @REQ-05 | `positive` | **PASSED** | 14.8s | `REQ-05` |
| `TC-020` | TC-020: Terms of Service unchecked blocks submission @REQ-05 | `positive` | **PASSED** | 17.6s | `REQ-05` |
| `TC-021` | TC-021: Only the 18+ Age confirmation unchecked blocks submission with specific error @REQ-05 | `positive` | **PASSED** | 17.4s | `REQ-05` |
| `TC-022` | TC-022: Brand-new unique email and username pass the uniqueness check @REQ-06 | `positive` | **PASSED** | 7.8s | `REQ-06` |
| `TC-023` | TC-023: Duplicate email (already-registered wholesale account) blocks submission with clear error @smoke @REQ-06 | `negative` | **PASSED** | 22.9s | `REQ-06` |
| `TC-024` | TC-024: Duplicate username blocks submission with clear error @REQ-06 | `negative` | **PASSED** | 24.3s | `REQ-06` |
| `TC-025` | TC-025: Case-variant duplicate email blocks submission @REQ-06 | `negative` | **PASSED** | 7.9s | `REQ-06` |
| `TC-026` | TC-026: Admin sees full submitted wholesale data in Advanced B2B/B2C > Registration Applications @REQ-07 | `positive` | **FAILED** | 31.5s | `REQ-07` |
| `TC-027` | TC-027: Registration Applications list correctly handles no matching application, no crash @REQ-07 | `positive` | **FAILED** | 14.7s | `REQ-07` |
| `TC-028` | TC-028: Admin activates account via Active flag + save — login enabled @REQ-08 | `positive` | **FAILED** | 31.2s | `REQ-08` |
| `TC-029` | TC-029: Login attempt before admin approval is blocked with inactive-account message @REQ-08 | `positive` | **PASSED** | 21.9s | `REQ-08` |
| `TC-030` | TC-030: Admin deactivates a previously-active account — login blocked again @REQ-08 | `positive` | **FAILED** | 29.5s | `REQ-08` |
