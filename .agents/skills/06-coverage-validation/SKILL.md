---
name: 06-coverage-validation
description: Validate 100% requirements-to-test coverage and output Traceability Matrix in Markdown (.md).
---

# Stage 6 — Coverage Validation Skill

## Overview
Stage 6 cross-checks every requirement ID (`REQ-ID`) against generated test cases and automated assertions in test specs. It outputs a human-readable Markdown Traceability Matrix (`memory/traceability/<story>.md`) and enforces a **100% Coverage Gate Condition**.

---

## 🛠️ Traceability Protocol

### 1. Requirements & Assertion Audit
- Read `parsed.json` requirement list.
- Read test case IDs from `<story>.tc.json`.
- Inspect spec files in `tests/e2e/` for test titles containing `REQ-XX` tags.
- **Assertion-Level Audit**: Verify that every `REQ-XX` requirement clause maps to at least 1 active automated `expect(...)` assertion inside spec files. Tests lacking assertions are flagged as `UNVERIFIED_ASSERTION`.

### 2. Coverage Calculation Formula
$$\text{Coverage \%} = \left( \frac{\text{Covered Requirements with Active Assertions}}{\text{Total Requirements}} \right) \times 100$$

### 3. Markdown Matrix Generation (`<story>.md`)
Write matrix to `memory/traceability/<story>.md` containing:
- Feature Summary & Story ID
- Overall Coverage Percentage & Scenario Type Counts (Positive, Negative, Edge)
- Requirements Traceability Table (`Req ID` | `Description` | `Test Cases` | `Spec File` | `Status`)

---

## 📄 Output Files
- `memory/traceability/<story>.md` (Human-readable Markdown Matrix)
- `memory/traceability/<story>.json` (Machine JSON Matrix)
- `memory/traceability/index.json` (Master Index)
