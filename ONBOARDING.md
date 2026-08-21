# 🚀 ONBOARDING.md — New Feature Quick-Start Guide

> **STR-003 fix** — Added 2026-08-21. Explains how to onboard a new feature end-to-end.
> After reading this file, you should be able to add any new test feature to the pipeline without reverse-engineering the orchestrator.

---

## What Is This Framework?

An 8-agent pipeline that converts a plain-English feature requirement into:
1. Atomic requirement clauses (REQ-IDs)
2. Exhaustive test cases (positive, negative, edge, boundary, a11y)
3. Live-verified DOM selectors
4. Playwright TypeScript specs with Page Object Model
5. Executed test results with self-healing
6. HTML executive report + traceability matrix

**The pipeline is stage-gated** — each stage checks that its dependencies exist before running. The orchestrator (`npx ts-node scripts/run-pipeline.ts --story={feature}`) tells you what's READY, BLOCKED, STALE, or ALREADY COMPLETE.

---

## 📋 Stage→Skill Quick Reference

| Stage | Name | Skill Folder | Produces |
|-------|------|-------------|---------|
| 0 | Test Data & Environment | `00-testdata-environment` | `envs/staging.md`, `testdata/{feature}/*.json` |
| 1 | Requirement Ingestion | `01-context-ingestion` | `requirements/{feature}/parsed.json`, `source.meta.json` |
| 2 | Test Case Design | `02-testcase-design` | `testcases/{feature}.tc.md`, `.tc.json` |
| 3 | Workflow Design | `03-workflow-design` | `workflows/{feature}.journey.json` |
| 4 | Live Explorer | `04-live-explorer` | `workflows/{feature}.verify.json`, `visual/*.png` |
| 5 | POM Codegen | `05-codegen-pom` | `pages/*.page.ts`, `tests/e2e/{feature}/*.spec.ts` |
| **6** | **Execution+Self-Heal** | `06-execution-self-heal` | `reports/generated/test-results.json` |
| **7** | **Coverage Validation** | `07-coverage-validation` | `memory/traceability/{feature}.md` |
| 8 | Report Generation | `08-report-generation` | `reports/generated/{feature}-report.html` |
| 9 | Learning & Memory | `09-learning-prevention` | `memory/healed-patterns.json` (updated) |

> ⚠️ **Note:** Stage 6 is Execution and Stage 7 is Coverage (not the other way around). Coverage runs AFTER execution so L4 checks work.

---

## 🏁 Adding a New Feature — Step-by-Step

### Step 1: Create the raw requirement

```
requirements/{feature}/source.md
```

Write the feature requirement in plain English. This file is **immutable** after ingestion — changes trigger version archiving. Example feature slug: `product-search` (use lowercase-kebab-case).

### Step 2: Run the pipeline status check

```bash
npx ts-node scripts/run-pipeline.ts --story={feature}
```

This tells you which stages are READY, BLOCKED, or COMPLETE. Stage 0 and Stage 1 will be READY on first run.

### Step 3: Run Stage 0 — Test Data & Environment

Read: `.agents/skills/00-testdata-environment/SKILL.md`

**What you do:**
- Verify `envs/staging.md` exists and `write-safe: true`
- Create `testdata/{feature}/users.json` with synthetic test accounts
- Verify credentials are resolvable via `process.env.*` variables

**Produces:** `testdata/{feature}/*.json`

### Step 4: Run Stage 1 — Requirement Ingestion

Read: `.agents/skills/01-context-ingestion/SKILL.md`

**What you do:**
- Compute SHA-256 hash of source.md
- Parse into atomic REQ-IDs (each a single verifiable clause)
- Flag any `NEEDS_CLARIFICATION` ambiguities and add to `memory/pending-questions.md`
- Write `memory/context-store.json` feature entry

**Produces:** `requirements/{feature}/parsed.json`, `source.meta.json`
**Gate:** Zero unresolved NEEDS_CLARIFICATION items

### Step 5: Run Stage 2 — Test Case Design (Loop A)

Read: `.agents/skills/02-testcase-design/SKILL.md`

**What you do:**
- Design test cases for every REQ-ID (positive, negative, edge, boundary, a11y)
- Self-critique via Loop A (max 5 iterations)
- Classify each TC: Layer (UI/API), Priority (P0/P1/P2), Type

**Produces:** `testcases/{feature}.tc.md`, `.tc.json`, `.stakeholder.md`
**Gate:** All REQ-IDs covered, Loop A converged

### Step 6: Run Stage 3 — Workflow Design

Read: `.agents/skills/03-workflow-design/SKILL.md`

**What you do:**
- Map test cases into end-to-end user journeys
- Identify state transitions and data dependencies
- Design parallel-safe journey groupings

**Produces:** `workflows/{feature}.journey.json`, `.journey.md`

### Step 7: Run Stage 4 — Live Explorer

Read: `.agents/skills/04-live-explorer/SKILL.md`

**What you do:**
- Navigate the live site with browser subagent
- Capture real DOM selectors with tier ranking
- Verify each selector against the designed journey
- For features with admin-side verification: perform write action THEN check admin panel (see ANTI-007)
- Run axe accessibility scan
- Capture visual screenshots

**Produces:** `workflows/{feature}.verify.json`, `workflows/{feature}/visual/*.png`

> ⚠️ **Gate check:** If `journey.json` and `verify.json` step counts differ by >20%, flag `FLOW_MISMATCH` and resolve before proceeding.

### Step 8: Run Stage 5 — POM Codegen

Read: `.agents/skills/05-codegen-pom/SKILL.md`

**What you do:**
- Load TRUSTED patterns from `memory/pattern-library.md`
- Generate Page Object Model class in `pages/{feature}.page.ts`
- Generate spec file in `tests/e2e/{feature}/{feature}.spec.ts`
- Add selectors to `utils/selectors.ts` with `verifiedAt` timestamp
- Update `memory/page-dependency-index.md`

**Produces:** `pages/*.page.ts`, `tests/e2e/{feature}/*.spec.ts`

### Step 9: Run Stage 6 — Execute & Self-Heal

```bash
npm run test:{feature}  # e.g., npm run test:b2b
```

**What happens automatically:**
- Tests run in headed single-browser mode
- Failures are classified by Agent 5 (Loop B)
- Self-healing attempts up to 5 times per failing test
- `memory/run-history/{feature}-{date}.json` is written
- Custom HTML report is generated in teardown

### Step 10: Run Stage 7 — Coverage Validation

```bash
npx ts-node scripts/validate-coverage.ts --story={feature}
```

This now runs all 4 levels (L1-L4) and outputs full `FULLY_COVERED | TC_ONLY | UNVERIFIED_ASSERTION | NOT_EXECUTED | UNCOVERED` flags per REQ-ID.

**Produces:** `memory/traceability/{feature}.md`, `memory/traceability/{feature}.json`

### Step 11: Generate Report (Stage 8)

```bash
npm run report:{feature}
```

**Produces:** `reports/generated/{feature}-report.html`, `.report.md`

### Step 12: Run Learning Loop (Stage 9)

```bash
npm run sync:memory     # Sync heal-log.md → self-heal-log.json
npm run distill:patterns # Check pattern lifecycle promotions
```

---

## 🔁 Re-Running After a Requirement Change

1. Edit `requirements/{feature}/source.md`
2. Run `npx ts-node scripts/run-pipeline.ts --story={feature}` — it will detect SHA-256 diff and mark downstream stages as STALE
3. Re-run only the STALE stages (not the whole pipeline from scratch)
4. Unchanged REQ-IDs keep their existing TCs, journeys, and specs

---

## 🧹 Useful Utility Commands

| Command | Purpose |
|---------|---------|
| `npm run verify:auth` | Check auth cookies are valid before running |
| `npm run cleanup:check` | Detect orphaned test data from crashed runs |
| `npm run a11y:report` | View accessibility findings summary |
| `npm run qa:coverage:all` | Validate coverage for ALL features |
| `npm run sync:memory` | Sync heal-log.md → self-heal-log.json |
| `npm run distill:patterns` | Check pattern lifecycle promotions (Loop C) |
| `npm run typecheck` | Verify TypeScript compiles before committing |

---

## 🔍 Key Files to Know

| File | Purpose |
|------|---------|
| `.agents/AGENTS.md` | Pre-flight checklist — read FIRST |
| `memory/decisions.md` | Known answers — check before asking questions |
| `memory/pattern-library.md` | Distilled rules — load before any codegen |
| `memory/healed-patterns.json` | TRUSTED patterns — inject pre-emptively |
| `memory/context-store.json` | Per-feature metadata (wizard steps, URLs, etc.) |
| `utils/selectors.ts` | ONLY place selectors live — never inline |
| `COMMANDS.md` | All npm commands + agent reference table |

---

## ⚠️ Common Mistakes (Read Before Starting)

1. **Don't skip the orchestrator check** — always run `scripts/run-pipeline.ts` to get current state
2. **Don't inline selectors** — every selector goes in `utils/selectors.ts`
3. **Don't screenshot an empty admin grid and call it "verified"** — perform the write action first (ANTI-007)
4. **Don't use `selectOption()` on Select2 dropdowns** — use the 4-step click-fill-wait-click strategy (D-005)
5. **Don't trust "no exception thrown" as proof of success** — always verify via cookie, URL, or DOM element (ANTI-006)
6. **Don't wrap core test actions in `if (await locator.isVisible())`** — use `await expect(locator).toBeVisible()`
7. **Don't run tests on production** — staging only (`write-safe: true` in `envs/staging.md`)

---

*Last updated: 2026-08-21 | STR-003 implementation*
