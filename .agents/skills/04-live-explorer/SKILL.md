---
name: 04-live-explorer
description: Explore live application DOM to verify selectors, capture multi-tier locator candidates, record negative/error states, run accessibility scans, capture visual baselines, and enforce write-action safety.
---

# Agent 3 (Execution Phase) — Live Explorer Skill

## Overview

The Live Explorer visits the actual live/staging application via browser subagent tools and walks the real flows described by the test cases and journeys. It **grounds automation in reality rather than assumption** — capturing real selectors, real error messages, real page transitions, and real UI quirks. This is the **Feasibility Bridge** between design-time artifacts and executable code.

> **Golden Rule:** If the live site behaves differently from what the test cases expect, the TEST CASE or REQUIREMENT is wrong — not reality. Escalate discrepancies, don't ignore them.

---

## 🛠️ Live Exploration Protocol

### 1. Pre-Flight Safety Check

Before ANY live site interaction:

1. **Verify target environment** is marked `write-safe: true` in `envs/{env}.md` (for write actions).
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
2. Log violations to `memory/a11y-findings.md`:

```markdown
## {Feature} — a11y Scan Results ({date})

### Page: {URL}
| Impact | Rule | Element | Description |
|--------|------|---------|-------------|
| critical | label | `input#Email` | Form element has no associated label |
| serious | color-contrast | `.btn-primary` | Element has insufficient color contrast ratio |
```

3. **Non-blocking**: a11y findings do NOT stop the pipeline. They build a backlog.

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

### 8. Scheduled Drift Re-Verification

Independent of requirement changes, stable/high-priority features should be re-explored periodically:

- **Cadence**: Weekly for P0 features, monthly for P1/P2.
- **Purpose**: Catch environment drift — a redesigned page, changed validation, or new popup that nobody logged.
- **Action**: Re-run Agent 3 for the feature, diff against previous `.verify.json`.
- **If drift detected** → Flag as `DRIFT_DETECTED` and trigger downstream re-verification.

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

## ✅ Gate Condition
- All interactive elements have verified selectors with tier rankings.
- All negative/error states captured with verbatim messages.
- Dynamic widgets documented with handling strategies.
- Write-action safety enforced.
- Visual baselines captured.

## ❌ Blocked Conditions
- Target environment unreachable → `ENVIRONMENT_ISSUE`, retry later.
- Environment not `write-safe` and feature requires write actions → Read-only mode, flag limitations.
- Agent 0 has not provisioned test data → Cannot explore with data.
