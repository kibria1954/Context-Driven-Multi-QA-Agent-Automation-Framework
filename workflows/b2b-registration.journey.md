# User Journeys — B2B Registration

**Feature:** `b2b-registration` | **Generated:** 2026-08-15 | **Total Journeys:** 10 (covering all 30 TCs)

**State Model:** `S0:Initial → S1:Created → S2:Processing → S3:Active → S4:Terminal`

---

## J-01: Full Happy Path Lifecycle — Registration → Admin Review → Approval → Login

**Entry State:** S0 (Guest, not authenticated)
**Exit State (Success):** S3 (Active account, can log in)
**Exit State (Failure):** S1 (Stuck pending if admin action fails)

### Steps:
1. **[TC-001]** Guest submits complete, valid registration → `S0 → S1` (ERP account + Ship-To address + inactive customer created, mapped)
2. **[TC-026]** Admin opens Advanced B2B/B2C → Registration Applications, sees the applicant's full submitted data → `S1 → S2` (under review)
3. **[TC-028]** Admin checks "Active" flag, saves → `S2 → S3` (active, welcome email sent, login enabled)

### Data Dependencies (from Agent 0):
- Synthetic customer: unique email, 11-digit BD phone, unique company name
- Admin session: `tests/.auth/admin.json`

### Parallel Safety: ❌ SERIAL_ONLY
- Reason: one customer entity is carried through registration → review → approval; J-09 uses its own separate account to avoid coupling, but J-10 explicitly depends on this journey completing first.

---

## J-02: Valid Input Variants — Alternate Business Type & Contact Media

**Entry State:** S0 | **Exit (Success):** S1 | **Exit (Failure):** S0

### Steps:
1. **[TC-002]** Submit with an alternate Type of Business + Contact Media = Messenger → `S0 → S1`
2. **[TC-005]** Submit with all Company Info fields validly filled, across multiple business types → `S0 → S1`
3. **[TC-011]** Select Contact Media = WhatsApp, verify field reveal, submit → `S0 → S1`
4. **[TC-012]** Select Contact Media = Messenger, verify field reveal, submit → `S0 → S1`
5. **[TC-015]** Submit with all Account Setup fields validly filled → `S0 → S1`
6. **[TC-019]** Submit with all 4 agreements checked → `S0 → S1`

### Data Dependencies: Synthetic customer per scenario, own namespace.

### Parallel Safety: ✅ PARALLEL_SAFE — each scenario uses its own namespaced account.

---

## J-03: Required-Field & Format Validation (Negative, Data-Driven)

**Entry State:** S0 | **Exit (Success):** N/A (all rejected) | **Exit (Failure):** S0

### Steps:
1. **[TC-003 / TC-006]** Submit with Company Name blank → `S0 → S0` (rejected, field error)
2. **[TC-007]** Submit with malformed Email → `S0 → S0` (rejected)
3. **[TC-016]** Submit with Password ≠ Confirm Password → `S0 → S0` (rejected)
4. **[TC-017]** Submit with empty Password → `S0 → S0` (rejected)
5. **[TC-020]** Submit with Terms of Service unchecked → `S0 → S0` (rejected)

### Parallel Safety: ✅ PARALLEL_SAFE — no entity is ever created, nothing to collide on.

---

## J-04: Boundary & Edge Data Handling

**Entry State:** S0 | **Exit:** mixed (see per-step)

### Steps:
1. **[TC-008]** Submit with 10-digit / 11-digit / 12-digit phone → 11-digit succeeds (`S0 → S1`), others rejected (`S0 → S0`)
2. **[TC-009]** Submit Company Name with Unicode/special characters → `S0 → S1`
3. **[TC-010]** Submit Zip Code empty vs whitespace-only → `S0 → S0` (both rejected)
4. **[TC-018]** Submit Username with special characters/spaces → behavior observed live in Stage 4
5. **[TC-021]** Submit with only 18+ confirmation unchecked → `S0 → S0` (rejected)

### Parallel Safety: ✅ PARALLEL_SAFE — each boundary case uses its own namespaced data.

---

## J-05: Contact Media Dynamic Toggle Behavior

**Entry State:** S0 | **Exit (Success):** S1 | **Exit (Failure):** S0

### Steps:
1. **[TC-013]** Select WhatsApp, fill number, switch to Messenger, fill Messenger fields, submit → `S0 → S1` (WhatsApp value not submitted)
2. **[TC-014]** Select WhatsApp, leave number blank, submit → `S0 → S0` (rejected)

### Parallel Safety: ✅ PARALLEL_SAFE

---

## J-06: Uniqueness Validation (Duplicate Email/Username)

**Entry State:** S0 | **Exit (Success):** S1 | **Exit (Failure):** S0

### Steps:
1. **[TC-022]** Submit with a brand-new unique email/username → `S0 → S1`
2. **[TC-023]** Submit with Email = `userKBD@gmail.com` (known existing wholesale account) → `S0 → S0` (rejected)
3. **[TC-024]** Submit with a known-existing Username → `S0 → S0` (rejected)
4. **[TC-025]** Submit with a case-variant of `userKBD@gmail.com` → behavior observed live in Stage 4

### Data Dependencies: fresh synthetic account (TC-022) + fixed known account `userKBD@gmail.com` (TC-023, TC-025).

### Parallel Safety: ⚠️ SERIAL_WITHIN_FEATURE — safe alongside other features, but keep serial within this feature so TC-022's entity creation doesn't race the duplicate-check reads.

---

## J-07: Submission Integrity — Rapid Double-Click

**Entry State:** S0 | **Exit:** S1 (exactly once, not twice)

### Steps:
1. **[TC-004]** Fill valid form, double-click "Create Account" rapidly → `S0 → S1` — exactly one entity created.

### Parallel Safety: ✅ PARALLEL_SAFE

---

## J-08: Admin Visibility — Registration Applications No-Match State

**Entry State:** S2 (admin session) | **Exit:** S2 (no crash)

### Steps:
1. **[TC-027]** Admin searches Registration Applications for a non-matching email/name → clean "no records" grid state, no crash.

### Parallel Safety: ✅ PARALLEL_SAFE — read-only.

---

## J-09: Pre-Approval Login Block

**Entry State:** S1 | **Exit:** S1 (login rejected)

### Steps:
1. **[TC-029]** Register a fresh account, immediately attempt login before any admin action → `S1 → S1`, login blocked with inactive-account message.

### Parallel Safety: ✅ PARALLEL_SAFE — dedicated fresh account, deliberately not reusing J-01's, to avoid ordering coupling with the approval step.

---

## J-10: Post-Approval Deactivation

**Entry State:** S3 | **Exit:** S4 (deactivated, login rejected)

### Steps:
1. **[TC-030]** Admin unchecks "Active" on J-01's now-active account, saves, attempts login → `S3 → S4`, login blocked.

### Parallel Safety: ❌ SERIAL_ONLY — must run after J-01 completes (depends on its account already being active).

---

## Async State Transition Handlers

| Pattern | Strategy | Max Wait |
|---------|----------|----------|
| Admin approval (UI) | Poll admin customer grid, check Active status | 30s |
| Email notification (welcome/activation) | Not directly testable E2E without a mail server — flag as limitation unless the app surfaces an observable in-app signal | N/A |
| AJAX form submission | `waitForAjaxComplete()` + bar notification | 15s |
| Page redirect after submit | `waitForURL()` exact path match | 10s |

## Cross-Feature Journey Awareness

None yet — `b2b-registration` is the only feature currently active in this pipeline reset cycle. Once `wholesale-checkout` and `wishlist-management` are re-ingested, a meta-journey (Register → Login → Wishlist → Checkout) should be added here per Section 7 of `03-workflow-design/SKILL.md`.
