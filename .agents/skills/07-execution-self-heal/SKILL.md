---
name: 07-execution-self-heal
description: Execute Playwright test suites, classify failures via 7-class error taxonomy (including cascading shared-infrastructure failures), perform Loop B self-healing with semantic verification and review gates, manage flaky quarantine, and record all heal evidence.
---

# Agent 5 — Execution & Safe Self-Healing Skill (Loop B)

## Overview

Agent 5 runs the generated test suite, and when something fails, it classifies the failure **before doing anything else**. It applies safe self-healing with semantic verification (confirming healed locators actually point to the right element), enforces a review gate on broad changes, manages a flaky quarantine for recurring transient failures, and records every heal action with full evidence for the Learning Loop.

> **Golden Rule:** Self-healing is verification-first, not apply-and-hope. A healed locator that resolves to the wrong element is WORSE than a broken test — it's a silent false pass.

---

## 🌐 Execution Configuration

### Single Browser Headed Mode (Default Development)
```bash
npx playwright test {spec} --headed --workers=1
```

### Headless CI Mode
```bash
npx playwright test {spec} --workers=4
```

### Sharded Parallel Mode (Large Suites)
```bash
npx playwright test --shard=1/4  # Run on 4 parallel workers
```

---

## 🚨 Cascading Failure Pattern Recognition (Run FIRST, Before Per-Test Classification)

**Incident (2026-08-18):** A broken selector in `tests/global-setup.ts` silently saved an unauthenticated `storageState`. Every test reusing it then failed independently on unrelated-looking symptoms (`#SearchEmail` not found, "context has been closed", grid rows missing) — each of which *could* be individually mis-classified as `FLAKY_LOCATOR` and "healed" by hunting for a different `#SearchEmail` selector that would never exist, burning the 5-attempt circuit breaker on a fix that was never going to work, without ever pointing at the real root cause.

**Before running the per-test decision tree below**, scan the batch of failures from this run for this shape:

1. **≥3 different test cases fail at the same early step** inside the same shared-context helper (e.g. `withAdminPage()`, any helper that consumes `tests/.auth/*.json`) — regardless of how different their individual error messages look.
2. If found, **suspect shared setup/auth infrastructure FIRST**:
   - Check `reports/generated/setup-status.json` (written by `tests/global-setup.ts`) for a recorded failure.
   - If missing/inconclusive, independently verify the relevant `tests/.auth/*.json` actually contains proof of a logged-in session (e.g. the `.Nop.Authentication` cookie for this app — not just a non-empty cookie array).
3. If shared infra is broken, classify as **`SETUP_INFRA_ISSUE`** (not `FLAKY_LOCATOR`) and fix the ONE setup script — do not spend healing attempts on the individual downstream tests, they will all resolve once setup is fixed.
4. Only fall through to per-test classification below once shared infra is confirmed healthy.

> **Why this matters:** the failure classes below (`FLAKY_LOCATOR`, `REAL_BUG`, etc.) are designed for *code Agent 4 generated and Agent 3 verified* — `tests/global-setup.ts`, `tests/global-teardown.ts`, and `playwright.config.ts` are hand-authored infrastructure that no skill currently re-verifies live (see `04-live-explorer/SKILL.md`'s Infrastructure Verification section) or subjects to the semantic-match rigor applied to page-object selectors. Until that's true, this pattern check is the safety net.

---

## 🛠️ Failure Classification Protocol

On **every** test failure, classify BEFORE attempting any fix:

### Decision Tree

```
Test Failed
    │
    ├── Is the error a TimeoutError / element not found?
    │   ├── YES → Check if element exists with different selector
    │   │   ├── Found with alt selector → FLAKY_LOCATOR
    │   │   └── Element genuinely missing from DOM → Check if page changed
    │   │       ├── Page structure changed → FLAKY_LOCATOR (structural)
    │   │       └── Page unchanged, element should be there → REAL_BUG
    │   └── NO → Continue
    │
    ├── Is the error an assertion mismatch (expect() failed)?
    │   ├── Expected text/value differs from actual?
    │   │   ├── Actual value looks like a valid app response → REAL_BUG
    │   │   └── Actual value is empty/wrong type → SCRIPT_LOGIC_ERROR
    │   └── Expected state (visible/hidden) differs?
    │       ├── Timing-related (works on retry) → FLAKY_LOCATOR (timing)
    │       └── Consistently wrong → REAL_BUG or SCRIPT_LOGIC_ERROR
    │
    ├── Is the error data-related (duplicate, constraint violation)?
    │   └── YES → TEST_DATA_ISSUE
    │
    ├── Is the error network-related (ECONNREFUSED, 502, timeout)?
    │   └── YES → ENVIRONMENT_ISSUE
    │
    └── Is the error complex / ambiguous / involves business logic?
        └── YES → UNSAFE_OR_BUSINESS_LOGIC
```

---

## 🔧 Error Taxonomy & Self-Heal Actions

$$\text{Auto-Heal Trigger} = (\text{Confidence} \ge 90\%) \land (\text{Safe Change Type}) \land (\text{Semantic Verification Passed}) \land (\text{Evidence Captured}) \land (\text{Anti-Regression Passed})$$

### Class 1: `FLAKY_LOCATOR`

**Trigger:** `TimeoutError`, element not visible, selector changed.

**Self-Heal Steps:**
1. Re-run Agent 3 (Live Explorer) for the specific element ONLY.
2. Capture new locator candidates with tier ranking.
3. **Semantic Verification Gate** — confirm the new locator resolves to an element matching:
   - Same `role` (button, input, link, etc.)
   - Same or similar `text content`
   - Same `position/context` in the DOM (e.g., inside the same form)
   - Same `element type` (input, button, select, etc.)
4. If semantic match confidence ≥ 90% → append the new candidate to that entry's `fallbacks` array in `utils/selectors.ts` (the structured field, not a comment — see `05-codegen-pom/SKILL.md` Section 2).
5. Run anti-regression check on all dependent specs.
6. If regression passes → promote the new candidate to be the entry's primary `selector` (keep the old one in `fallbacks` for reference) and commit the heal.

**Evidence to Record:**
```json
{
  "oldSelector": "#old-button-id",
  "newSelector": "#new-button-id",
  "semanticMatch": {
    "role": "button → button ✅",
    "text": "Submit → Submit Application ⚠️ (close match)",
    "context": "inside form#register ✅",
    "confidence": 0.92
  },
  "regressionPassed": true
}
```

### Class 2: `SCRIPT_LOGIC_ERROR`

**Trigger:** `expect()` assertion failed, step ordering wrong, wrong expected value.

**Self-Heal Steps:**
1. Compare expected vs actual values.
2. Check if the actual value is a legitimate app response (not an error).
3. If script step order is wrong → reorder steps.
4. If expected value was hardcoded incorrectly → fix to match verified journey.
5. Run anti-regression.

### Class 3: `TEST_DATA_ISSUE`

**Trigger:** Duplicate entity, data constraint violation, stale test data.

**Self-Heal Steps:**
1. Call `utils/data-provisioner.ts` to generate fresh data with new `run-id`.
2. Update test data fixture files.
3. Re-run the affected test with fresh data.
4. NO code changes needed — data-only fix.

### Class 4: `ENVIRONMENT_ISSUE`

**Trigger:** `ECONNREFUSED`, `502 Bad Gateway`, network timeout, DNS failure.

**Self-Heal Steps:**
1. Log the environment error.
2. Quarantine the test in `memory/flaky-quarantine.md` with `reason: "environment_issue"`.
3. Schedule retry for later (don't block the pipeline).
4. NO code changes.

### Class 5: `UNSAFE_OR_BUSINESS_LOGIC`

**Trigger:** Complex business logic change, ambiguous error that could be app behavior OR test issue.

**Action:**
1. Transition to `NO_SAFE_FIX` state.
2. Preserve original code — DO NOT modify.
3. Write escalation report to `reports/quarantine/{feature}-no-safe-fix.md`.
4. Append question to `memory/pending-questions.md`.
5. **STOP and escalate to owner immediately.**

### Class 6: `REAL_BUG`

**Trigger:** Functional mismatch vs verified journey — the app genuinely behaves differently from the verified requirement.

**Action:**
1. **DO NOT SELF-HEAL.** The test is correct; the app is broken.
2. Generate bug report with:
   - Exact repro steps (from executed test steps)
   - Expected vs actual behavior
   - Screenshot/video evidence
   - Linked REQ-ID and AC
3. Quarantine the test (it should fail until the bug is fixed).
4. Write to `reports/quarantine/{feature}-bugs.md`.

### Class 7: `SETUP_INFRA_ISSUE`

**Trigger:** Caught via the Cascading Failure Pattern Recognition check above — ≥3 unrelated-looking test failures trace back to shared infrastructure (`tests/global-setup.ts`, `tests/global-teardown.ts`, `playwright.config.ts`) rather than any individual test or page object.

**Self-Heal Steps:**
1. **DO NOT** attempt to heal the individual downstream tests — their locators/logic are likely correct; they're failing as a *symptom*.
2. Identify the specific infra script and line responsible (auth login, storageState creation, report generation timing, project/timeout config).
3. Apply the same rigor as `FLAKY_LOCATOR` semantic verification, but to the infra script's OWN success condition:
   - If the script performs a UI action whose result other code depends on (login, form submit), verify via an unambiguous signal (session cookie, redirected URL, authenticated-only element) — see `memory/pattern-library.md` ANTI-006. Never trust "no exception was thrown."
   - If the script combines a specific and a generic selector in one `.first()` call, check whether the generic half could match an unrelated element elsewhere on the page — see ANTI-005.
   - If the script waits a fixed delay for another process (a reporter, a file write) to finish, replace it with a poll against a verifiable freshness signal — see ANTI-008.
4. Fix the ONE infra script. Re-run the full batch of previously-failing tests together (not just one) to confirm they now pass as a group — this is the anti-regression check for this class.
5. **Always flag for human review** (`⚠️` in the Review Gate table below) — infra scripts affect every test in the suite, so no infra heal auto-commits regardless of confidence.
6. Record the heal in `memory/heal-log.md` as usual, and add a new entry to `memory/pattern-library.md`'s Anti-Patterns section if the root cause is a reusable lesson (selector pattern, missing verification, timing assumption) — infra bugs are exactly the kind of single-point-of-failure worth distilling, since one fix here prevents an entire class of downstream false failures.

---

## 🛡️ Review Gate on Healed Code

| Change Scope | Confidence | Action |
|-------------|-----------|--------|
| Single locator swap | ≥ 90% + semantic match | ✅ Auto-commit |
| Multiple locator swaps on same page | ≥ 90% each | ⚠️ Flag for human review |
| Structural page object change | Any | ❌ Human review required |
| Assertion value change | Any | ❌ Human review required |
| Step order change | ≥ 95% | ⚠️ Flag for human review |
| Any `SETUP_INFRA_ISSUE` fix (`global-setup.ts`, `global-teardown.ts`, `playwright.config.ts`) | Any | ❌ Human review required — affects every test in the suite |

---

## 🔶 Flaky Quarantine Management

A test enters quarantine when it fails transiently across **2+ consecutive runs**:

```markdown
## Flaky Quarantine Register

| Test | Feature | First Flaky | Consecutive Fails | Root Cause | Status |
|------|---------|-------------|-------------------|------------|--------|
| TC-005 | b2b-reg | 2026-08-10 | 3 | Timing on admin page load | QUARANTINED |

### Quarantine Rules:
- Quarantined tests are EXCLUDED from pipeline gating (they don't block merges)
- They remain in the suite and are still executed (to detect if they self-resolve)
- After 5 consecutive passes, they exit quarantine automatically
- After 2 weeks in quarantine with no resolution, escalate for manual investigation
```

---

## 🛑 Hard Circuit Breaker Limits

| Limit | Value | On Breach |
|-------|-------|-----------|
| Healing Attempts per failure | Max 5 | STOP → Rollback → Escalate |
| Evidence Retries | Max 2 | STOP → Rollback → Escalate |
| Regression Impact Cycles | Max 1 | STOP → Rollback → Escalate |
| Total heals per run | Max 10 | STOP → Flag as systemic issue |

---

## 🛡️ Anti-Regression Guard & Mandatory Rollback

1. **Before committing any heal**: Execute all dependent spec files in headless mode.
2. **If regression detected**: Immediately rollback the heal (`git checkout` for affected files).
3. **`NO_SAFE_FIX` state**: If root cause is understood but fix would change business logic → preserve original code, escalate.
4. **Mandatory rollback**: Any heal that fails anti-regression → automatic rollback, no exceptions.

---

## 📄 Heal Evidence Recording

Every heal action is recorded in `memory/heal-log.md` (append-only):

```markdown
## Heal Record — {timestamp}

- **Run ID:** `{run-id}`
- **Test:** TC-003 ({feature})
- **Failure Class:** `FLAKY_LOCATOR`
- **Error:** TimeoutError: locator('#old-submit-btn') — element not found
- **Root Cause:** Button ID changed from `#old-submit-btn` to `#kd-register-submit`
- **Action:** Updated selector in `utils/selectors.ts` line 298
- **Semantic Verification:** ✅ role=button, text="Submit Application", inside form#register
- **Confidence:** 94%
- **Anti-Regression:** ✅ Passed (3/3 dependent specs)
- **Auto-Committed:** ✅ Yes (single locator swap, high confidence)
```

---

## 📄 Output Files
- `memory/self-heal-log.json` (Machine-readable execution audit log)
- `memory/heal-log.md` (Human-readable heal evidence — append-only)
- `memory/flaky-quarantine.md` (Quarantined test register)
- `reports/quarantine/{feature}-no-safe-fix.md` (Escalation reports for `NO_SAFE_FIX` / `REAL_BUG`)
- `results/{feature}-run-{n}.json` (Execution results)
- `reports/generated/test-results.json` (Raw Playwright output)

## ✅ Gate Condition
- Suite passes (all non-quarantined tests green), OR
- All failures classified and either healed safely or escalated with evidence.
- No unverified heals committed.
- Heal evidence recorded for every change.

## ❌ Blocked Conditions
- No spec files exist (Agent 4 incomplete) → Nothing to execute.
- Environment unreachable → Quarantine all tests, retry later.
- Circuit breaker hit → Full stop, escalate with complete context.
