# Requirements Traceability Matrix: b2b-registration

- **Story ID:** `STORY-B2B_REGISTRATION`
- **Feature:** `b2b-registration`
- **Last Updated:** 2026-08-17T09:50:29.710Z
- **Overall Coverage:** **100%** (8/8 Requirements Covered)
- **Total Test Cases:** **30** (Positive: 10, Negative: 9, Edge/Security: 8)

## Coverage Summary

| Metric | Count |
|---|---|
| **Total Requirements** | 8 |
| **Covered Requirements** | 8 (100%) |
| **Uncovered Requirements** | 0 |
| **Total Test Cases Mapped** | 30 |

## Requirements to Test Cases Traceability Table

| Requirement ID | Requirement Description | Mapped Test Cases | Spec File(s) | Status |
|---|---|---|---|---|
| **REQ-01** | Positive: Successful B2B registration creates ERP account, Ship-To address, inactive customer, mapping, and redirects to review page | `TC-001` (positive), `TC-002` (positive), `TC-003` (negative), `TC-004` (edge) | `tests\e2e\registration\b2b-registration.spec.ts` | ✅ Covered |
| **REQ-02** | Positive: All Company Info fields accepted across different Type of Business dropdown options | `TC-005` (positive), `TC-006` (negative), `TC-007` (negative), `TC-008` (boundary), `TC-009` (edge), `TC-010` (boundary) | `tests\e2e\registration\b2b-registration.spec.ts` | ✅ Covered |
| **REQ-03** | Positive: Selecting WhatsApp reveals required WhatsApp Number field, Messenger fields hidden | `TC-011` (positive), `TC-012` (positive), `TC-013` (edge), `TC-014` (negative) | `tests\e2e\registration\b2b-registration.spec.ts` | ✅ Covered |
| **REQ-04** | Positive: Valid Username, Password, Confirm Password, dropdown, and business textarea accepted | `TC-015` (positive), `TC-016` (negative), `TC-017` (boundary), `TC-018` (edge) | `tests\e2e\registration\b2b-registration.spec.ts` | ✅ Covered |
| **REQ-05** | Positive: All 3 required checkboxes checked (ToS, Privacy Policy, 18+) allows submission — Wholesale Agreement is display text, not a checkbox | `TC-019` (positive), `TC-020` (negative), `TC-021` (edge) | `tests\e2e\registration\b2b-registration.spec.ts` | ✅ Covered |
| **REQ-06** | Positive: Brand-new unique email and username pass the uniqueness check | `TC-022` (positive), `TC-023` (negative), `TC-024` (negative), `TC-025` (edge) | `tests\e2e\registration\b2b-registration.spec.ts` | ✅ Covered |
| **REQ-07** | Positive: Admin sees full submitted wholesale data in Advanced B2B/B2C > Registration Applications | `TC-026` (positive), `TC-027` (edge) | `tests\e2e\registration\b2b-registration.spec.ts` | ✅ Covered |
| **REQ-08** | Positive: Admin activates account via Active flag + save — login enabled and welcome email sent | `TC-028` (positive), `TC-029` (negative), `TC-030` (edge) | `tests\e2e\registration\b2b-registration.spec.ts` | ✅ Covered |
