---
name: 02-testcase-design
description: Generate comprehensive positive, negative, and edge test cases (Loop A design self-critique).
---

# Stage 2 — Test Case Design Skill (Loop A)

## Overview
Stage 2 reads `parsed.json` from Stage 1 and generates a comprehensive test suite covering Positive (Happy Path), Negative (Validation), and Edge/Security scenarios for every requirement ID (`REQ-ID`). It executes **Loop A (Self-Critique Engine)** up to 5 iterations until 100% coverage is achieved.

---

## 🛠️ Loop A Multi-Criteria Design Rules

For **every** story and requirement clause (`REQ-ID`):
1. **Scenario Matrix Multiplier Protocol**:
   - Every story MUST generate a minimum of **8-12 comprehensive test cases**.
   - **Positive Scenarios (≥3-5)**: Primary flow, variant input selections, multi-entry point navigations.
   - **Negative / Security Scenarios (≥2-3)**: Duplicate entity handling, format mismatch, unauthenticated redirects, boundary breaches.
   - **Edge & UI Scenarios (≥2-3)**: Empty state handling, rapid double clicks, toggle field clearing, network retries.
2. **Traceability Guarantee**: Every generated test case (`TC-xxx`) MUST strictly link to a specific `requirementId` or Acceptance Criterion.
3. **Boundary & Edge Scenarios**: Must evaluate boundary value analysis (min, min-1, max, max+1, 0, negative values).
4. **Context-Aware Security Scope**: Security/destructive payloads (e.g. `' OR 1=1 --`, `<script>`) are generated **ONLY** when explicitly scoped by requirement risk profiles, preventing destructive mutations during standard functional QA runs.

### 🛑 Multi-Criteria Convergence Stopping Gate
Loop A terminates and passes Stage 2 **ONLY** when all 7 evaluation dimensions pass:
$$\text{Pass Gate} = \text{Req Coverage} \land \text{Risk Coverage} \land \text{Business Rules} \land \text{Boundary Accuracy} \land \text{Data Validity} \land \text{Feasibility} \land \text{Traceability}$$
- **Hard Circuit Breaker**: Maximum **5 iterations**. If limit is reached, preserve best state and flag for human review.

---

## 📄 Test Case Markdown Format (`<story>.tc.md`)

Each test case must follow this exact Markdown structure:

```markdown
## TC-001 — Happy Path: <Scenario Summary> — REQ-01

- **Requirement:** REQ-01
- **Type:** positive
- **Layer:** functional
- **Priority:** critical
- **Tags:** smoke, regression, req-01
- **Status:** draft

**Preconditions:**
- <Prerequisite state, e.g. User is on target page `/path`>

**Steps:**
1. Navigate to target URL or component
2. Fill required input fields with valid data
3. Execute primary action (e.g. Click submit / save / proceed button)

**Expected Result:** Action completes successfully, target state transitions occur, and appropriate confirmation message or view is displayed.
```

---

## 📄 Output Files
- `context/test-cases/<story>.tc.md` (Human-readable Markdown format)
- `context/test-cases/<story>.tc.json` (Machine pipeline format)
