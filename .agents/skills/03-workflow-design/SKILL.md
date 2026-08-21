---
name: 03-workflow-design
description: Map individual test cases into end-to-end user journeys with state transitions, data dependency graphs, negative/error flows, parallel-safe tagging, and cross-feature journey awareness.
---

# Agent 3 (Design Phase) — Workflow Design Skill

## Overview

The Workflow Design phase maps atomic test cases from Agent 2 into cohesive end-to-end user journeys. It establishes state transitions, identifies data dependencies (what Agent 0 must provision), determines which journeys can run in parallel, and builds cross-feature meta-journeys where features chain together (e.g., Register → Login → Wishlist → Checkout).

> **Golden Rule:** A journey is not just a list of steps — it's a state machine with explicit entry conditions, transition guards, and exit states for both success and failure paths.

---

## 📁 Files to Load

- **This file** (full read).
- `testcases/{feature}.tc.json` — every TC must map into a journey.
- `memory/decisions.md` — cross-surface claims ("admin sees X after customer does Y") often have a prior owner decision recorded; check before assuming a location.
- **Don't load:** `utils/selectors.ts` or `pages/*.page.ts` — no selectors exist yet at this stage; journeys describe state transitions and actions in prose, not DOM detail (that's Stage 4).

## ⚠️ Common Mistakes

- **Mapping only happy-path journeys.** Section 3 is explicit: every journey set MUST include negative/error flows, not just J-01-style success paths.
- **Asserting a cross-surface effect ("Admin sees the submitted application") as a journey step without flagging it needs live verification.** This is exactly the class of claim that caused the REQ-07 admin-URL incident (see `07-coverage-validation/SKILL.md` D-001 / `06-execution-self-heal/SKILL.md` Class 8) — a journey step describing what SHOULD happen is not proof of where it actually happens; that proof is Stage 4's job (Section 7a there), but a journey step that states the surface with false confidence sets Stage 4 up to skip real verification.
- **Mis-tagging parallel safety.** A journey that mutates shared state (e.g. account creation → admin approval) tagged `PARALLEL_SAFE` will cause flaky cross-test interference that looks like a completely unrelated bug later.
- **Omitting data dependencies.** If Agent 0 doesn't know a journey needs a specific entity shape, it can't provision it — Section 4 isn't optional documentation, Agent 0 reads it.

## ✅ Gate Condition (check before starting, and again before marking this stage done)
- All TCs from Agent 2 mapped to at least one journey.
- Every journey has explicit entry/exit states.
- Data dependencies documented for Agent 0.
- Negative/error flow journeys included.
- Parallel safety tagged.

## ❌ Blocked Conditions
- Test cases not yet generated (Agent 2 incomplete) → Cannot map journeys.
- Data dependencies that Agent 0 cannot provision → Escalate to owner.

---

## 🛠️ Workflow Design Protocol

### 1. Enhanced State Machine Model

Map the lifecycle of every entity across user roles using a 5-state model:

| State | Description | Example |
|-------|------------|---------|
| `S0: Initial` | Unauthenticated / empty / no entity exists | Guest on homepage |
| `S1: Created` | Entity submitted / pending / awaiting processing | Registration submitted, account inactive |
| `S2: Processing` | Admin or system reviewing / validating | Admin reviewing customer application |
| `S3: Active` | Entity approved / operational / fully functional | Account activated, can log in and order |
| `S4: Terminal` | Entity completed / archived / deleted | Order delivered, account deactivated |

**Transition Guards:**
- `S0 → S1`: Requires valid input data (from Agent 0), passing all form validations
- `S1 → S2`: System auto-triggers or admin manually initiates review
- `S2 → S3`: Admin approval action OR system auto-approval rule
- `S3 → S4`: Completion action, time-based expiry, or manual deactivation
- **Error transitions**: `S1 → S0` (validation failure, back to form), `S2 → S0` (rejection, account denied)

### 2. Journey Structuring

Group individual `TC-XXX` items into ordered journeys:

```markdown
## J-01: {Feature Name} — Happy Path End-to-End Pipeline

**Entry State:** S0 (Guest user, not authenticated)
**Exit State (Success):** S3 (Active account, logged in)
**Exit State (Failure):** S0 (Redirected to form with error messages)

### Steps:
1. **[TC-001]** Guest navigates to registration → `S0 → S1` (Form visible)
2. **[TC-002]** Guest fills Step 1 (Company Info) → `S1` (Step 1 complete)
3. **[TC-003]** Guest fills Step 2 (Account Setup) → `S1` (Step 2 complete)
4. **[TC-004]** Guest fills Step 3 (Agreements) + Submit → `S1 → S2` (Application submitted)
5. **[TC-005]** Admin reviews application in admin panel → `S2` (Under review)
6. **[TC-006]** Admin approves (sets Active flag) → `S2 → S3` (Account active)
7. **[TC-007]** Customer logs in with new credentials → `S3` (Dashboard visible)

### Data Dependencies (from Agent 0):
- Synthetic email: `test.{ts}@qa-test.example.com`
- BD phone number: `017XXXXXXXX`
- Company name: `QA-Auto-{runId} Corp`

### Parallel Safety: ❌ SERIAL ONLY
- Reason: Account creation + admin approval involves shared state
```

### 3. Negative & Error Flow Journeys

Do NOT only map happy paths. Every journey set MUST include:

```markdown
## J-02: {Feature Name} — Duplicate Email Rejection Flow

**Entry State:** S0 (Guest, valid data exists from J-01)
**Exit State:** S0 (Still on form, error message displayed)

### Steps:
1. **[TC-008]** Guest navigates to registration → `S0`
2. **[TC-008]** Guest fills form with ALREADY-USED email → `S0`
3. **[TC-008]** Guest submits → `S0 → S0` (REJECTION)
   - **Error Message:** "The specified email already exists"
   - **DOM State:** `.validation-summary-errors` visible
   - **URL State:** Still on `/register`
```

### 4. Data Dependency Graph

For each journey, explicitly document what test data is required:

```json
{
  "journeyId": "J-01",
  "dataDependencies": [
    {
      "entity": "customer",
      "source": "Agent 0 - data-provisioner",
      "fields": ["email", "phone", "companyName"],
      "uniquePerRun": true,
      "cleanupRequired": true
    },
    {
      "entity": "admin-session",
      "source": "global-setup.ts",
      "fields": ["storageState"],
      "uniquePerRun": false
    }
  ]
}
```

### 5. Parallel-Safe vs Serial-Only Tagging

| Tag | When to Use | Example |
|-----|------------|---------|
| `PARALLEL_SAFE` | Journey uses only its own namespaced data, no shared state mutations | Read-only catalog browsing, isolated wishlist ops |
| `SERIAL_ONLY` | Journey creates/mutates shared state that other journeys depend on | Registration → Admin approval chain |
| `SERIAL_WITHIN_FEATURE` | Parallel across features but serial within one feature | Multiple wishlist tests can run parallel to checkout tests |

### 6. Async State Transition Handlers

Define explicit wait strategies for async transitions:

| Pattern | Strategy | Max Wait |
|---------|----------|----------|
| Admin approval (UI) | Poll admin table, check entity status | 30s |
| Email notification | Intercept or skip (not testable in E2E without mail server) | Flag as limitation |
| AJAX form submission | Wait for `networkidle` + bar notification | 15s |
| Page redirect | `waitForURL()` with exact path match | 10s |

### 7. Cross-Feature Journey Awareness

When features chain together, define meta-journeys:

```markdown
## META-J-01: Full Customer Lifecycle (Register → Login → Wishlist → Checkout)

### Sub-Journeys:
1. J-01 (Registration) → produces: active customer account
2. J-LOGIN (Login) → produces: authenticated session
3. J-WISHLIST (Wishlist Management) → produces: items in wishlist
4. J-CHECKOUT (Wholesale Checkout) → produces: completed order

### Data Flow:
- Registration J-01 creates customer → Login uses same credentials → Wishlist uses same session → Checkout uses same cart

### Execution Mode: STRICTLY SERIAL (upstream output = downstream input)
```

---

## 📄 Output Files
- `workflows/{feature}.journey.md` (Human-readable journey document)
- `workflows/{feature}.journey.json` (Machine-readable journey data with state transitions)

_(Gate Condition and Blocked Conditions are listed near the top of this file, before the protocol — check them first.)_
