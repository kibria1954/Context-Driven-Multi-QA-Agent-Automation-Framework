---
name: 06-coverage-validation
description: Validate 100% requirements-to-test coverage with assertion-level depth audit, cross-feature impact detection, flaky quarantine tracking, layer/priority breakdowns, and stakeholder coverage summary.
---

# Agent 6 — Coverage & Traceability Validation Skill

## Overview

Agent 6 builds the complete traceability chain: **Requirement clause → Test Case → Automation Script → Execution result**. It flags gaps at every level, checks cross-feature impact when shared pages change, accounts for quarantined-flaky tests that compromise real coverage, and produces both technical and stakeholder-readable coverage reports.

> **Golden Rule:** "100% coverage" is meaningless if the tests aren't actually running. Quarantined tests, skipped tests, and tests without assertions are NOT coverage — flag them honestly.

---

## 🛠️ Traceability Protocol

### 1. Multi-Level Coverage Audit

For each REQ-ID in `requirements/{feature}/parsed.json`:

| Level | Check | Pass Criteria |
|-------|-------|---------------|
| **L1: TC Exists** | REQ-ID has ≥ 1 linked TC in `testcases/{feature}.tc.json` | At least one TC references this REQ-ID |
| **L2: Spec Exists** | TC has a corresponding spec file in `tests/e2e/` or `tests/api/` | Spec file exists and contains test matching TC-ID |
| **L3: Assertion Exists** | Spec contains active `expect(...)` assertion for this REQ-ID | At least one `expect()` call validates the REQ outcome |
| **L4: Execution Exists** | Spec was actually executed in the latest run | Test result exists in `results/` (not skipped/quarantined) |

**Coverage flags:**

| Flag | Meaning |
|------|---------|
| `FULLY_COVERED` | L1 + L2 + L3 + L4 all pass |
| `TC_ONLY` | L1 passes, but no spec file (L2 fails) |
| `UNVERIFIED_ASSERTION` | L1 + L2 pass, but no active `expect()` found (L3 fails) |
| `NOT_EXECUTED` | L1 + L2 + L3 pass, but test was skipped or quarantined (L4 fails) |
| `UNCOVERED` | L1 fails — no TC at all for this REQ-ID |

### 2. Coverage Calculation

$$\text{Coverage \%} = \left( \frac{\text{REQ-IDs at FULLY\_COVERED status}}{\text{Total REQ-IDs}} \right) \times 100$$

**Secondary metrics:**
- **Effective Coverage**: Excludes quarantined tests from numerator
- **Layer Coverage**: UI-layer coverage % and API-layer coverage % separately
- **Priority Coverage**: P0 coverage % (critical), P1 coverage %, P2 coverage %

### 3. Assertion-Level Depth Audit

Scan spec files for actual `expect(...)` calls and validate:

```typescript
// This counts as an assertion:
await expect(page).toHaveURL('/register/result');
await expect(page.locator('.result')).toBeVisible();

// This does NOT count:
console.log('Registration successful'); // No assertion!
if (await locator.isVisible()) { /* soft check — BANNED */ }
```

**Rules:**
- Every `test()` block MUST contain at least one `expect()` or `toHaveURL()`.
- Tests without assertions are flagged as `UNVERIFIED_ASSERTION`.
- Soft `if` guards on core actions are flagged as violations of Rule 10.

### 4. Cross-Feature Impact Check

When a page object changes (Agent 4 codegen or Agent 5 healing):

1. Read `memory/page-dependency-index.md`.
2. Identify all features using the changed page.
3. Flag affected features for re-verification:

```markdown
### ⚠️ Cross-Feature Impact Alert

**Changed Page:** `register.page.ts`
**Affected Features:**
- `b2b-registration` — Direct user, likely needs re-test
- No other features currently share this page.

**Changed Page:** `login.page.ts`
**Affected Features:**
- `b2b-registration` — Uses login for admin verification
- `wishlist-management` — Uses login for authenticated tests
- `wholesale-checkout` — Uses login for checkout flow
**Recommendation:** Re-run Agent 3 (verify) + Agent 5 (execution) for all affected features.
```

### 5. Flaky Quarantine Impact

Read `memory/flaky-quarantine.md` and report coverage impact:

```markdown
### 🔶 Quarantined Tests Impacting Coverage

| Test | Feature | Quarantined Since | REQ-IDs Affected | Real Coverage Impact |
|------|---------|-------------------|------------------|---------------------|
| TC-005 | b2b-reg | 2026-08-10 | REQ-47, REQ-49 | -2 REQ-IDs from effective coverage |

**Effective Coverage (excluding quarantined):** 92% (vs 100% on paper)
```

### 6. Stakeholder Coverage Summary

Plain-language coverage status for non-technical reviewers:

```markdown
## Coverage Summary for Stakeholders

### {Feature Name}

**Overall Status:** ✅ All requirements have automated tests

**What's Covered:**
- ✅ User can register a new B2B account (tested with 3 scenarios)
- ✅ System rejects duplicate emails (tested with 1 scenario)
- ✅ Admin can review and approve applications (tested with 2 scenarios)

**What's At Risk:**
- ⚠️ TC-005 (Admin email verification) is currently flaky and quarantined
- This means the email notification check is not actively running

**Numbers:** 12/12 requirements covered, 10/10 tests passing, 2 tests quarantined
```

---

## 📄 Traceability Matrix Format (`{feature}.md`)

```markdown
# 🎯 Traceability Matrix — {Feature Name}

**Feature:** `{feature-slug}`
**Generated:** `{iso-timestamp}`
**Coverage:** **{coverage}%** ({covered}/{total} REQ-IDs fully covered)
**Effective Coverage:** **{effective}%** (excluding quarantined tests)

## Coverage by Layer
| Layer | Covered | Total | Coverage |
|-------|---------|-------|----------|
| UI    | {n}     | {n}   | {n}%     |
| API   | {n}     | {n}   | {n}%     |

## Coverage by Priority
| Priority | Covered | Total | Coverage |
|----------|---------|-------|----------|
| P0       | {n}     | {n}   | {n}%     |
| P1       | {n}     | {n}   | {n}%     |
| P2       | {n}     | {n}   | {n}%     |

## Scenario Type Breakdown
| Type | Count |
|------|-------|
| Positive | {n} |
| Negative | {n} |
| Edge     | {n} |
| Boundary | {n} |

## Requirements Traceability Table

| REQ-ID | Description | Test Cases | Spec File | Assertion? | Executed? | Status |
|--------|-------------|------------|-----------|------------|-----------|--------|
| REQ-01 | {desc}      | TC-001     | {file}    | ✅         | ✅        | `FULLY_COVERED` |
| REQ-47 | {desc}      | TC-005     | {file}    | ✅         | ❌ (quarantined) | `NOT_EXECUTED` |
```

---

## 📄 Output Files
- `memory/traceability/{feature}.md` (Human-readable traceability matrix)
- `memory/traceability/{feature}.json` (Machine-readable matrix)
- `memory/traceability/index.json` (Master index across all features)

## ✅ Gate Condition
- Every REQ-ID mapped to at least one automated assertion.
- Cross-feature impact checked and reported.
- Quarantine impact quantified.
- Coverage percentage calculated (overall, effective, by layer, by priority).

## ❌ Blocked Conditions
- No spec files generated yet (Agent 4 incomplete) → Cannot validate coverage.
- `parsed.json` unavailable → Cannot map REQ-IDs.
