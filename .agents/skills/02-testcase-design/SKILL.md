---
name: 02-testcase-design
description: Generate exhaustive positive, negative, edge, boundary, and accessibility-tagged test cases with Loop A self-critique, test pyramid layer classification (UI/API), priority tagging (P0/P1/P2), and stakeholder-readable export.
---

# Agent 2 — Test Case Design Skill (Loop A)

## Overview

Agent 2 reads `parsed.json` from Agent 1 and generates a comprehensive, traceable test suite covering Positive (Happy Path), Negative (Validation), Edge, Boundary/Data-Driven, and Accessibility scenarios. It executes **Loop A (Self-Critique Engine)** up to 5 iterations until 100% requirement coverage is achieved. Every test case is classified by test pyramid layer (UI vs API) and priority (P0/P1/P2) to enable intelligent execution strategies.

> **Golden Rule:** If a requirement clause has zero test cases covering it after Loop A completes, the agent has FAILED.

---

## 🛠️ Test Case Generation Protocol

### 1. Scenario Matrix Multiplier

For **every** feature and requirement clause (`REQ-ID`):

| Category | Minimum Count | What to Cover |
|----------|--------------|---------------|
| **Positive** | ≥ 3–5 | Primary happy path, variant inputs, multi-entry navigation, all valid dropdown options |
| **Negative** | ≥ 2–3 | Duplicate entity handling, format mismatch, unauthenticated redirects, missing required fields, boundary breaches |
| **Edge** | ≥ 2–3 | Empty state handling, rapid double-clicks, toggle field clearing, network retry, max-length inputs, Unicode/special chars |
| **Boundary** | ≥ 1–2 | Min, min-1, max, max+1, 0, negative values, empty string vs whitespace-only |
| **Accessibility** | As applicable | Missing labels, focus order, keyboard navigation, color contrast (flagged, not blocking) |

**Total minimum per feature: 8–15 comprehensive test cases.**

### 2. Layer Classification (Test Pyramid Awareness)

Each test case MUST be tagged with a **Layer** column:

| Layer | When to Use | Execution Target |
|-------|------------|------------------|
| `UI` | Tests that specifically verify rendering, navigation, form interaction, visual state | `tests/e2e/{feature}/*.spec.ts` (Playwright browser) |
| `API` | Tests that only verify business logic, data validation, response shape | `tests/api/{feature}/*.spec.ts` (direct HTTP, no browser) |
| `UI+API` | Tests requiring both — e.g., submit via UI, verify via API | Both directories |

> **Default heuristic:** If a test case's assertion can be verified by checking an API response without needing to see the UI → mark it `API`. Reserve `UI` for cases that genuinely test user-facing interaction.

### 3. Priority Tagging

| Priority | Criteria | Execution Context |
|----------|---------|-------------------|
| `P0` | Core happy path, business-critical, blocks release | Fast-tier CI (every commit), full browser matrix |
| `P1` | Important validation, common negative paths | Full-tier CI (nightly), primary browser only |
| `P2` | Edge cases, boundary, nice-to-have coverage | Full-tier CI (nightly), Chromium-only |

### 4. Traceability Guarantee

- Every TC MUST link to a specific `requirementId` (REQ-XX).
- Every TC MUST link to an Acceptance Criteria (AC-XX) where applicable.
- TCs without linkage are **REJECTED** by Loop A.

### 5. Context-Aware Security Scope

Security/destructive payloads (e.g. `' OR 1=1 --`, `<script>alert(1)</script>`) are generated **ONLY** when:
- The requirement explicitly mentions input sanitization, security validation, or XSS/SQLi protection.
- The risk profile of the feature warrants it (e.g., public-facing form with no auth).

Never run destructive payloads against production or shared environments.

---

## 🔄 Loop A — Multi-Criteria Self-Critique Engine

### Iteration Protocol

1. **Generate** first-pass test cases from `parsed.json`.
2. **Re-read** the requirement clause-by-clause. For each:
   - Is there at least one TC covering this clause?
   - Does the TC have valid steps, expected results, and layer/priority tags?
3. **Check 7 convergence dimensions** (see gate below).
4. **If gaps found** → generate missing cases, append to the suite.
5. **Check for duplicates/redundancy** → merge or drop.
6. **Repeat** up to 5 iterations or until zero new gaps found two rounds in a row.
7. **If still uncertain** about intent of a specific clause after 5 loops → log to `memory/pending-questions.md` and escalate.

### 🛑 Multi-Criteria Convergence Stopping Gate

Loop A terminates ONLY when ALL 7 dimensions pass:

$$\text{Pass Gate} = \text{Req Coverage} \land \text{Risk Coverage} \land \text{Business Rules} \land \text{Boundary Accuracy} \land \text{Data Validity} \land \text{Feasibility} \land \text{Traceability}$$

| Dimension | Pass Criteria |
|-----------|--------------|
| **Req Coverage** | Every REQ-ID has ≥ 1 linked TC |
| **Risk Coverage** | Every `critical` priority REQ-ID has ≥ 2 TCs (positive + negative) |
| **Business Rules** | Every business rule (BR-XX) has explicit validation TC |
| **Boundary Accuracy** | Numeric/string-length fields have min/max/boundary TCs |
| **Data Validity** | Test data values are realistic, locale-appropriate (BD for KBD), non-hardcoded |
| **Feasibility** | TCs are executable against the known UI/API structure (no invented selectors) |
| **Traceability** | Every TC → REQ-ID → AC-XX chain is complete |

**Hard Circuit Breaker:** Maximum 5 iterations. If limit reached, preserve best state and flag for human review.

### Iteration Tracking Output

After each Loop A iteration, append to `memory/convergence/{feature}-loopA.json`:

```json
{
  "iteration": 1,
  "timestamp": "{iso-timestamp}",
  "dimensions": {
    "reqCoverage": { "pass": true, "covered": 12, "total": 12 },
    "riskCoverage": { "pass": true, "criticalCovered": 6, "criticalTotal": 6 },
    "businessRules": { "pass": true, "rulesCovered": 3, "rulesTotal": 3 },
    "boundaryAccuracy": { "pass": false, "missing": ["REQ-08: phone number max length"] },
    "dataValidity": { "pass": true },
    "feasibility": { "pass": true },
    "traceability": { "pass": true }
  },
  "gapsFilled": 2,
  "duplicatesRemoved": 0,
  "converged": false
}
```

---

## 📄 Test Case Markdown Format (`{feature}.tc.md`)

Each test case MUST follow this exact structure:

```markdown
## TC-001 — Happy Path: {Scenario Summary} — REQ-01

- **Requirement:** REQ-01
- **Acceptance Criteria:** AC-01
- **Type:** positive | negative | edge | boundary | accessibility
- **Layer:** UI | API | UI+API
- **Priority:** P0 | P1 | P2
- **Tags:** smoke, regression, req-01
- **Status:** draft | ready | automated | quarantined

**Preconditions:**
- {Prerequisite state, e.g., "User is on `/register` page, not logged in"}
- {Test data requirement, e.g., "Synthetic email from Agent 0: `test.{ts}@qa-test.example.com`"}

**Steps:**
1. Navigate to {URL}
2. Fill {field} with {value} (valid/invalid/boundary)
3. Click {button/action}
4. Observe {system response}

**Expected Result:**
- **URL State:** User is redirected to `{expected-path}`
- **DOM State:** {Specific element} is visible with text "{expected text}"
- **Data State:** {Entity created/updated/blocked} with {specific attribute values}

**Negative Specifics (if applicable):**
- **Missing Element:** {Element X} is NOT visible
- **Disabled State:** {Button Y} has `disabled` attribute
- **Error Message:** Exact text: "{The specific error message verbatim}"
```

### Test Case JSON Schema (`{feature}.tc.json`)

```json
{
  "feature": "{feature-name}",
  "generatedAt": "{iso-timestamp}",
  "loopAIterations": 3,
  "totalTestCases": 12,
  "testCases": [
    {
      "id": "TC-001",
      "title": "Happy Path: {Summary}",
      "requirementId": "REQ-01",
      "acceptanceCriteria": "AC-01",
      "type": "positive",
      "layer": "UI",
      "priority": "P0",
      "tags": ["smoke", "regression", "req-01"],
      "status": "draft",
      "preconditions": [],
      "steps": [],
      "expectedResult": {
        "urlState": "/register/result",
        "domState": "Success message visible",
        "dataState": "Customer account created as inactive"
      },
      "negativeSpecifics": null
    }
  ]
}
```

---

## 📋 Stakeholder Export (`{feature}.stakeholder.md`)

Alongside the technical TC table, generate a plain-language version for non-technical reviewers:

```markdown
# Test Scenarios — {Feature Name} (Stakeholder Review)

## What We're Testing

{1-2 sentence plain summary of the feature}

## Scenarios

### ✅ Happy Path Scenarios
1. **{Scenario title}** — A user does {action} and sees {outcome}. ✅ Expected: {business outcome}

### ❌ Error Handling Scenarios
2. **{Scenario title}** — A user tries {invalid action} and the system {blocks/warns/redirects}. ❌ Expected: {error behavior}

### 🔲 Edge Cases
3. **{Scenario title}** — When {unusual condition}, the system {handles gracefully}. 🔲 Expected: {edge outcome}
```

---

## 📄 Output Files
- `testcases/{feature}.tc.md` (Human-readable Markdown test cases)
- `testcases/{feature}.tc.json` (Machine-readable pipeline format)
- `testcases/{feature}.stakeholder.md` (Plain-language stakeholder export)
- `memory/convergence/{feature}-loopA.json` (Loop A iteration tracking)

## ✅ Gate Condition
- Loop A convergence gate passed (all 7 dimensions).
- Every REQ-ID mapped to ≥ 1 TC.
- All TCs have valid Layer and Priority tags.
- Stakeholder export generated.

## ❌ Blocked Conditions
- Unresolved `NEEDS_CLARIFICATION` from Agent 1 → Cannot generate TCs for ambiguous clauses.
- Loop A hits 5 iterations without convergence → Preserve best state, escalate.
