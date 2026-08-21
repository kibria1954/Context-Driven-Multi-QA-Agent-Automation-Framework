---
name: 04-live-explorer
description: Explore live application DOM to verify selectors, capture multi-tier locator candidates, record negative/error states, run accessibility scans, capture visual baselines, and enforce write-action safety.
---

# Agent 3 (Execution Phase) — Live Explorer Skill

## Overview

The Live Explorer visits the actual live/staging application via browser subagent tools and walks the real flows described by the test cases and journeys. It **grounds automation in reality rather than assumption** — capturing real selectors, real error messages, real page transitions, and real UI quirks. This is the **Feasibility Bridge** between design-time artifacts and executable code.

> **Golden Rule:** If the live site behaves differently from what the test cases expect, the TEST CASE or REQUIREMENT is wrong — not reality. Escalate discrepancies, don't ignore them.

---

## 📁 Files to Load

- **This file** (full read).
- `workflows/{feature}.journey.json` — the flows to actually walk.
- `envs/{env}.md` — write-safety flag, base/admin URLs.
- `memory/decisions.md` and `memory/healed-patterns.json` (TRUSTED entries, especially `patternType: "anti-pattern"`) — known widget/modal handling and prior corrections (e.g. admin URL locations) before re-discovering them from scratch.
- **Don't load:** `tests/e2e/**/*.spec.ts` or `pages/*.page.ts` — those don't exist yet; this stage produces the raw material Stage 5 turns into them.

## ⚠️ Common Mistakes

- **Treating "the page loaded with plausible column headers" as verification.** This is THE incident this file documents at length in Section 7a — a page rendering is not proof it reflects the claimed effect. Always perform the triggering action, search for the specific value, and confirm a matching row before marking `verified: true`.
- **Accepting a verbal "confirmed with the owner" as a substitute for the 4-step proof in Section 7a.** A chat confirmation about which page is a lead worth checking, not evidence on its own.
- **Skipping the infrastructure verification in Section 9** for `global-setup.ts`/`global-teardown.ts` because they're "just scaffolding." A broken login selector there fails every downstream test with misleading individual symptoms (see the Cascading Failure Pattern in `06-execution-self-heal/SKILL.md`).
- **Writing `verify.json` once and never revisiting it.** After a `memory/decisions.md` correction (e.g. D-001), the `verify.json` record itself must be updated too — a corrected page object with a stale `verify.json` still describing the old wrong location is exactly the kind of divergence `npm run reconcile:workflow` (Section 7, GAP-013) is built to catch. Run it after any correction.
- **Leaving negative-state error text paraphrased instead of verbatim** — Agent 5's semantic-verification heals and Agent 6's assertion audits both depend on exact text.

## ✅ Gate Condition (check before starting, and again before marking this stage done)
- All interactive elements have verified selectors with tier rankings.
- All negative/error states captured with verbatim messages.
- Dynamic widgets documented with handling strategies.
- Write-action safety enforced.
- Visual baselines captured.
- Every "surface A shows effect of action on surface B" claim has a populated-state screenshot with matching test data, not just a page-loads screenshot (Section 7a).
- Auth-establishing infrastructure (`tests/global-setup.ts`) has a confirmed auth-cookie signal recorded, not assumed (Section 9).
- `npm run reconcile:workflow -- --story={feature}` reports no unresolved `CONTRADICTS_DECISION` / `UNVERIFIED_ADMIN_CLAIM` findings (Section 7 below) before handing off to Stage 5.

## ❌ Blocked Conditions
- Target environment unreachable → `ENVIRONMENT_ISSUE`, retry later.
- Environment not `write-safe` and feature requires write actions → Read-only mode, flag limitations.
- Agent 0 has not provisioned test data → Cannot explore with data.

---

## 🛠️ Live Exploration Protocol

### 1. Pre-Flight Safety Check

Before ANY live site interaction:

1. **Verify target environment is write-safe** by calling `isWriteSafe(envName)` from `utils/env.ts` (also what `agents/orchestrator.ts` uses to gate this stage) — don't just eyeball `envs/{env}.md`. If it returns `false` and the plan requires a write action (submit, delete, pay), stop: exploration proceeds read-only only.
2. **Load test data** provisioned by Agent 0 — NEVER invent accounts/records on the fly.
3. **Dismiss modals** on first navigation using `dismissAllModals()`.

### 2. Element & Selector Audit (Multi-Tier Capture)

For every interactive element in the workflow, capture **ALL viable locators** ranked by stability:

| Tier | Selector Type | Stability | Example |
|------|--------------|-----------|---------|
| **T1 (Best)** | `data-testid` / `data-qa` | Highest — purpose-built for testing | `[data-testid="submit-btn"]` |
| **T2** | `#id` | High — unique per page | `#CompanyName` |
| **T3** | Accessible role + label | High — semantic, a11y-friendly | `role=button[name="Submit"]` |
| **T4** | Unique `.class` | Medium — stable if class is semantic | `.register-next-step-button` |
| **T5** | CSS combinator | Medium — fragile if structure changes | `.form-group > input[type="email"]` |
| **T6** | `:has-text()` | Medium-Low — fragile if text changes | `button:has-text("Next")` |
| **T7 (Last Resort)** | XPath | Lowest — avoid unless nothing else works | `//form[@id='register']//button[1]` |

**Capture format per element:**

```json
{
  "elementName": "submitButton",
  "description": "Registration form submit button",
  "locatorCandidates": [
    { "tier": "T2", "selector": "#kd-register-submit", "verified": true },
    { "tier": "T4", "selector": "button.kd-register-submit-btn", "verified": true },
    { "tier": "T6", "selector": "button:has-text('Submit Application')", "verified": true }
  ],
  "recommendedSelector": "#kd-register-submit",
  "elementType": "button",
  "states": {
    "default": "enabled",
    "beforeValidation": "enabled",
    "afterValidation": "disabled | enabled"
  }
}
```

### 3. Dynamic Widget Detection & DOM Feasibility Pre-Check

Identify and document complex UI patterns that need special handling:

| Widget Type | Detection Pattern | Handling Strategy |
|------------|-------------------|-------------------|
| **Select2 dropdowns** | `span.select2-container` present | Click container → fill search → await options → click option |
| **Custom modals** | `.modal.show`, `#kdn-welcome-modal` | `dismissAllModals()` before test actions |
| **AJAX loaders** | `.ajax-loading-block-window` | `waitForAjaxComplete()` after form submissions |
| **Multi-step wizards** | `.kd-step.active` indicators | Track active step, use next/prev buttons with wait |
| **Iframe overlays** | `iframe` within modal | Switch to iframe context before interaction |
| **File upload** | `input[type="file"]` | Use `setInputFiles()` not click |
| **Date pickers** | Custom calendar widget | Check if native `input[type="date"]` works, else interact with picker |

### 4. Negative & Error State Capture

For every negative test case from Agent 2, **actually perform the invalid action** and capture:

1. **The exact error message text** (verbatim, not paraphrased):
   - Form validation: `span.field-validation-error` text content
   - Summary validation: `.validation-summary-errors` full text
   - Bar notification: `#bar-notification .content.error` text

2. **The exact DOM state**:
   - Which fields show red borders / error classes
   - Whether the submit button is disabled
   - Whether the form reset or retained values

3. **The exact URL state**:
   - Did the page redirect or stay on the same URL?
   - Did the URL hash change?

> This removes a major source of flaky assertions — error messages are OBSERVED, not guessed.

### 5. Lightweight Accessibility Scan (axe-core)

At each key page/state visited during exploration:

1. Run axe-core via `@axe-core/playwright` integration.
2. Log violations via `appendA11yFinding()` (`utils/memory-helpers.ts`) — **do not hand-append rows to `memory/a11y-findings.md`.** It dedupes by (feature, page, rule, element): a rescan of an already-`open` finding doesn't spawn a duplicate row, and rediscovering a `resolved`/`wontfix` finding automatically reopens it as a regression rather than leaving a stale row. The table carries a real `Status` column (`open` | `resolved` | `wontfix`) — mark one resolved with `npm run a11y:report -- --resolve --feature=... --page=... --rule=... --element=...` once it's actually fixed, don't just let it sit.

```markdown
| Impact | Rule | Element | Description | Feature | Page | Date | Status |
|--------|------|---------|-------------|---------|------|------|--------|
| critical | label | `input#Email` | Form element has no associated label | b2b-registration | /register | 2026-08-21 | open |
| serious | color-contrast | `.btn-primary` | Element has insufficient color contrast ratio | b2b-registration | /register | 2026-08-21 | open |
```

3. **Non-blocking**: a11y findings do NOT stop the pipeline. They build a backlog. `npm run a11y:report` summarizes open/resolved/wontfix counts by severity.

### 6. Visual Baseline Capture

At each key state in the workflow, capture a screenshot:

- **File path**: `workflows/{feature}/visual/{state-name}-{timestamp}.png`
- **States to capture**: Initial load, after form fill, after submission, success page, error state
- **Purpose**: Future visual regression diffing (optional tooling layer)

### 7. Workflow vs Reality Comparison Loop

After exploring all steps:

1. **Compare** observed flow against expected flow from `{feature}.journey.json`.
2. **If match** → Mark all steps as `verified: true` in `.verify.json`.
3. **If mismatch:**
   - Extra steps observed (e.g., unexpected modal, additional confirmation) → Self-correct the workflow record.
   - Different validation messages → Update expected results in `.verify.json`.
   - Flow fundamentally different → **ESCALATE** to owner: "The live site does {X} but the requirement says {Y}. Please clarify."

#### 7a. Verifying Claimed Cross-Surface Effects ("Admin sees X after customer does Y")

**Incident (2026-08-18):** REQ-07 claimed "admin sees the submitted wholesale application" at `/Admin/ErpRegistrationApplication/List`. Stage 4 visited that page, saw plausible column headers, and screenshotted it — but the screenshot itself shows **"No records."** No test registration had ever actually appeared there because that grid isn't fed by self-registration at all; the real location (`/Admin/ErpAccount/List`) was never checked. This was recorded as "confirmed real location... confirmed with the project owner" and shipped into `TC-026`/`TC-027`, which then failed against every real run until a human investigated live.

**A page loading with the right-looking columns is NOT verification.** When a requirement or journey step claims one surface (admin, a report, an email, another user's view) reflects an effect caused on a different surface, you MUST close the loop before marking it `verified: true`:

1. **Perform the actual triggering action** (e.g. submit the registration) with a data value you'll recognize (a unique company name, order ID, etc.) — reuse Agent 0's provisioned data, don't invent throwaway data.
2. **Navigate to the claimed destination surface** and search/filter for that *specific* value.
3. **Confirm a row/element containing that specific value is visible** — not just that the page/grid renders. If the grid is empty, paginated, or requires a search filter to surface the entry, note that in `handlingStrategy` and use it in codegen (Agent 4) too.
4. **Capture the populated-state screenshot**, not just the empty/initial-state one — `workflows/{feature}/visual/{state}.png` should show your actual test data, not a blank grid.
5. If step 3 fails (no matching row found anywhere reasonable — check pagination, check "Show: All" filters), **do not guess a fallback location and do not accept a verbal "confirmed with the owner" as a substitute.** Classify as unresolved and escalate: "Requirement says {surface} shows {effect} after {action} — after performing {action} with test data `{value}`, no matching record was found at {location}. Where does this actually appear?"
6. A verbal/chat confirmation from the project owner about *which page* is a lead worth checking, not evidence — it still needs step 1-4 proof before being marked `verified: true`.

#### 7b. Reconciling `verify.json` Against Design-Time and Decision Records (GAP-013)

`journey.json` (Stage 3's design intent) and `verify.json` (this stage's live-confirmed reality) are two independent files with no shared schema key, and `verify.json` can silently go stale after a `memory/decisions.md` correction — exactly what happened with the REQ-07 admin URL (D-001 corrected it 2026-08-18, but the `verify.json` record itself kept asserting the old, wrong URL as "CONFIRMED REAL LOCATION" for days afterward, even after the actual page-object code had already been fixed).

Run `npx ts-node scripts/reconcile-workflow.ts --story={feature}` (or `npm run reconcile:workflow -- --story={feature}`) before marking this stage's gate condition satisfied. It mechanically checks:
- Journey steps mentioning "Admin" have a non-superseded `/Admin/*` page recorded in `verify.json`.
- `verify.json` pages claiming a "confirmed"/"real location" note don't contradict a `/Admin/*` URL recorded as correct in `memory/decisions.md`.
- Every TC-ID referenced in `journey.json` has a matching test in the feature's spec file (once Stage 5 has run).
- `verify.json` pages with no corresponding journey-step coverage at all.

It's a mechanical pattern/keyword checker, not a semantic judge — a clean run doesn't replace Section 7a's live-verification discipline, but a flagged run means stop and look before trusting the affected record.

### 8. Scheduled Drift Re-Verification

Independent of requirement changes, stable/high-priority features should be re-explored periodically:

- **Cadence**: Weekly for P0 features, monthly for P1/P2.
- **Purpose**: Catch environment drift — a redesigned page, changed validation, or new popup that nobody logged.
- **Action**: Re-run Agent 3 for the feature, diff against previous `.verify.json`.
- **If drift detected** → Flag as `DRIFT_DETECTED` and trigger downstream re-verification.

### 9. Infrastructure Verification (Setup/Teardown/Config)

**Gap this closes:** `tests/global-setup.ts`, `tests/global-teardown.ts`, and `playwright.config.ts` are hand-authored once and then treated as fixed scaffolding — no skill currently re-verifies them the way feature pages get re-verified in Section 8. `03-workflow-design/SKILL.md` lists `global-setup.ts` only as a passive data *source* (`storageState`), and `05-codegen-pom/SKILL.md` just consumes `tests/.auth/admin.json` on trust. When that trust is misplaced (a broken login selector, e.g.), nothing catches it until every downstream test fails.

Apply the SAME live-verification rigor used for feature pages to this infrastructure, at these times:
- **Whenever `tests/global-setup.ts` is written or modified.**
- **On the same drift cadence as P0 features** (Section 8) — infra breaking silently is at least as costly as a P0 feature breaking.
- **Immediately, if Section 1 of the Cascading Failure Pattern Recognition check in `06-execution-self-heal/SKILL.md` fires** (≥3 unrelated test failures at the same early step in a shared-context helper).

**Verification protocol for auth-establishing setup code specifically:**
1. Run the setup script's login flow live, exactly as written.
2. Confirm success via an unambiguous signal — the actual session/auth cookie the app sets on real login (capture its name once via a real manual login and record it in `.verify.json`), not "the click didn't throw."
3. Confirm the button/element actually clicked is the one intended — if the selector is a comma-separated list, verify each alternative doesn't ALSO match an unrelated element earlier in the DOM (e.g. a header search button). See `memory/pattern-library.md` ANTI-005.
4. Record the confirmed auth-cookie name and the selector's semantic verification in `.verify.json` under a `infrastructure` key, so future changes to the login form trigger the same drift-detection review as a feature page would.

---

## 📄 Verification Log Schema (`{feature}.verify.json`)

```json
{
  "feature": "{feature-name}",
  "verifiedAt": "{iso-timestamp}",
  "environment": "staging",
  "baseUrl": "https://kbd.nop-station.site",
  "pages": [
    {
      "pageName": "Registration Page",
      "urlPattern": "/register*",
      "elements": [
        {
          "elementName": "companyNameInput",
          "description": "Company name text input",
          "locatorCandidates": [
            { "tier": "T2", "selector": "#CompanyName", "verified": true },
            { "tier": "T5", "selector": "input[name='CompanyName']", "verified": true }
          ],
          "recommendedSelector": "#CompanyName",
          "elementType": "input",
          "required": true,
          "states": { "default": "empty", "afterFill": "has-value" }
        }
      ],
      "dynamicWidgets": [
        {
          "widgetType": "Select2",
          "selector": "#TypeOfBusinessId",
          "handlingStrategy": "click container → fill search → click option",
          "verified": true
        }
      ],
      "modals": [
        {
          "modalName": "Welcome Popup",
          "selector": "#kdn-welcome-modal",
          "dismissal": "click .kdn-welcome-modal__close or dismissAllModals()",
          "appearsOn": "first-visit"
        }
      ],
      "negativeStates": [
        {
          "scenario": "Submit empty form",
          "errorMessages": [
            { "selector": "span[data-valmsg-for='CompanyName']", "text": "Company Name is required" }
          ],
          "formState": "retained-values",
          "urlState": "stayed-on-register"
        }
      ],
      "a11yFindings": [],
      "visualBaseline": "workflows/{feature}/visual/registration-initial.png"
    }
  ],
  "overallStatus": "verified" | "partial" | "drift_detected"
}
```

---

## 📄 Output Files
- `workflows/{feature}.verify.md` (Human-readable verification log)
- `workflows/{feature}.verify.json` (Machine-readable DOM verification data)
- `workflows/{feature}/visual/*.png` (Visual baselines per state)
- `memory/a11y-findings.md` (Accessibility scan results — appended)

_(Gate Condition and Blocked Conditions are listed near the top of this file, before the protocol — check them first.)_
