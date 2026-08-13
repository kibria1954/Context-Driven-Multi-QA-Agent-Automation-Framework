# Requirements Traceability Matrix: wholesale-checkout

- **Story ID:** `STORY-WHOLESALE_CHECKOUT`
- **Feature:** `wholesale-checkout`
- **Last Updated:** 2026-08-12T12:47:25.511Z
- **Overall Coverage:** **100%** (3/3 Requirements Covered)
- **Total Test Cases:** **10** (Positive: 4, Negative: 1, Edge/Security: 2)

## Coverage Summary

| Metric | Count |
|---|---|
| **Total Requirements** | 3 |
| **Covered Requirements** | 3 (100%) |
| **Uncovered Requirements** | 0 |
| **Total Test Cases Mapped** | 10 |

## Requirements to Test Cases Traceability Table

| Requirement ID | Requirement Description | Mapped Test Cases | Spec File | Status |
|---|---|---|---|---|
| **REQ-01** | Direct Order Confirmation Flow (Skip Payment & Address) | `TC-CHK-001` (positive), `TC-CHK-004` (positive), `TC-CHK-005` (negative), `TC-CHK-007` (security), `TC-CHK-009` (edge), `TC-CHK-010` (ui) | `tests\e2e\catalog\wishlist-management.spec.ts` | ✅ Covered |
| **REQ-02** | Default Registration Address Used as Shipping Address | `TC-CHK-002` (positive), `TC-CHK-006` (security) | `tests\e2e\catalog\wishlist-management.spec.ts` | ✅ Covered |
| **REQ-03** | Order Placed Successfully Despite Exceeded Credit Limit | `TC-CHK-003` (positive), `TC-CHK-008` (edge) | `tests\e2e\catalog\wishlist-management.spec.ts` | ✅ Covered |
