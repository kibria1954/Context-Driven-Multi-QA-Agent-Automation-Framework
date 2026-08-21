# 📜 QA AI Agent v2 — Central Command Registry (`COMMANDS.md`)

This file is the **Single Source of Truth** for running, debugging, and generating reports for all automated Playwright test suites in this project. All commands are pre-configured to launch visually in a **Single Browser Window** (`--headed --workers=1`) so you can watch clean sequential execution.

---

## 🌐 1. Single Browser Headed Commands (Sequential Live Watch)

### 👥 B2B Registration Suite
- **NPM Shortcut**:
  ```bash
  npm run test:b2b
  ```
- **Direct Playwright Command**:
  ```bash
  npx playwright test tests/e2e/registration/b2b-registration.spec.ts --headed --workers=1 --project=storefront-guest
  ```

### 💖 Wishlist Management Suite
- **NPM Shortcut**:
  ```bash
  npm run test:wishlist
  ```
- **Direct Playwright Command**:
  ```bash
  npx playwright test tests/e2e/catalog/wishlist-management.spec.ts --headed --workers=1
  ```

### 🛒 Wholesale Direct Checkout Suite
- **NPM Shortcut**:
  ```bash
  npm run test:checkout
  ```
- **Direct Playwright Command**:
  ```bash
  npx playwright test tests/e2e/checkout/wholesale-checkout.spec.ts --headed --workers=1
  ```

### 🚀 All Test Suites Together (Single Browser Sequential Run)
- **NPM Shortcut**:
  ```bash
  npm run test:all:headed
  ```
- **Direct Playwright Command**:
  ```bash
  npx playwright test tests/e2e/ --headed --workers=1
  ```

---

## 🧪 2. API-Layer Tests (No Browser)

### Run All API Tests
```bash
npm run test:api
```

### Direct Playwright Command
```bash
npx playwright test tests/api/ --workers=4
```

---

## 🎯 3. Priority-Based Execution

### P0 Only (Critical Smoke)
```bash
npm run test:p0
```

### P1 + P0 (Regression)
```bash
npx playwright test --grep "@P0|@P1" --headed --workers=1
```

---

## 🎛️ 4. Interactive UI & Debugging Modes

### 📊 Playwright Interactive UI Dashboard
```bash
npm run test:ui
```

### 🐞 Step-by-Step Inspector Debugger
```bash
npm run test:debug
```

---

## 📊 5. Executive HTML & Markdown Report Generation

- **Generate B2B Registration Report**:
  ```bash
  npm run report:b2b
  ```
- **Generate Wishlist Management Report**:
  ```bash
  npm run report:wishlist
  ```
- **Generate Wholesale Checkout Report**:
  ```bash
  npm run report:checkout
  ```
- **View Built-in Playwright Report**:
  ```bash
  npm run report:playwright
  ```
- **Generate Reports For Every Feature At Once** (GAP-003):
  ```bash
  npm run report:all
  ```
  Auto-discovers every feature with a `requirements/{feature}/parsed.json` — no need to add a new hardcoded npm script per feature.

> `recordRunHistory()` (`utils/report-helpers.ts`) is the ONLY writer of `memory/run-history/` — it runs automatically inside `generateCustomReport()`, which `tests/global-teardown.ts` already calls after every test run. Don't add a second run-history writer (GAP-011 incident: a duplicate writer with a different schema previously polluted the trend chart with false zero-value entries).

---

## 📏 6. Coverage & Traceability Validation

### Validate Requirements Coverage
```bash
npm run qa:coverage
```
### Validate Every Feature At Once (GAP-003)
```bash
npm run qa:coverage:all
```

### Reconcile Journey vs. Verify Records (GAP-013)
```bash
npm run reconcile:workflow -- --story=b2b-registration
npm run reconcile:workflow -- --all
```
Mechanically checks `workflows/{feature}.journey.json` against `workflows/{feature}.verify.json` and `memory/decisions.md` for divergence (e.g. a `verify.json` page still asserting a location that was already corrected by a later decision — this is the exact class of bug that caused the REQ-07 admin-URL incident). Writes `memory/reconciliation/{feature}.md`. Run before trusting Stage 4's output in Stage 5 codegen.

---

## 🧠 6b. Memory Sync & Pattern Distillation (Loop C — Learning & Prevention)

### Sync `self-heal-log.json` From `heal-log.md` & Check Pattern-Store Freshness
```bash
npm run sync:memory
```
Parses any `heal-log.md` records missing from `memory/self-heal-log.json` and appends them
(mechanical, does not fabricate pattern distillations), then reports whether
`memory/healed-patterns.json` is stale relative to the latest heal record. Run this at the end
of any Agent 5 / Agent ∞ session that appended to `heal-log.md` — see "Dual-Store Sync
Requirement" in `.agents/skills/09-learning-prevention/SKILL.md`.

### Trigger Pattern Lifecycle Checks (Loop C)
```bash
npm run distill:patterns
```
Checks pattern promotions (RAW→CANDIDATE→TRUSTED) and demotions (TRUSTED→DEPRECATED).
Does NOT invent new patterns — surfaces candidates for human/AI review. **Also runs
automatically** after every test run via `tests/global-teardown.ts` (GAP-006 fix,
2026-08-21) — this command is for on-demand/manual runs, it's no longer the only trigger.

---

## 🔐 6c. Pre-flight & Safety Checks

### Validate Auth Cookies Before Tests (GAP-009)
```bash
npm run verify:auth
```
Reads `tests/.auth/*.json` and asserts `.Nop.Authentication` cookie is present.
Also runs automatically as `pretest` before every `npm test`.

### Check for Orphaned Test Data (IMP-008)
```bash
npm run cleanup:check
```
Scans `testdata/*/cleanup-log.json` for entities with `cleanupRequired: true` but no cleanup confirmation.

### Accessibility Findings Summary (GAP-010)
```bash
npm run a11y:report
```
Groups open a11y findings by severity (real `Status` column now — open/resolved/wontfix, not guessed from description text), highlights critical issues.

### Resolve An Escalated Question (GAP-005)
```bash
npm run resolve:question -- --id=Q-... --answer="The answer text" --by=owner --applied-to=b2b-registration
```
The ONLY sanctioned way to answer a `memory/pending-questions.md` entry — flips its status to `✅ ANSWERED` AND appends the decision to `memory/decisions.md` in one step. Do not hand-edit either file directly (that's exactly how `decisions.md` went empty for weeks despite real answered questions).

---

## 🏷️ 7. Tag-Based Test Filtering (Single Browser)

- **Run Only `@smoke` Tests**:
  ```bash
  npx playwright test --grep @smoke --headed --workers=1
  ```
- **Run Only `@regression` Tests**:
  ```bash
  npx playwright test --grep @regression --headed --workers=1
  ```
- **Run Only `@security` / `@boundary` Tests**:
  ```bash
  npx playwright test --grep "@security|@boundary" --headed --workers=1
  ```

---

## 🔧 8. Development & Quality

### TypeScript Compilation Check
```bash
npm run typecheck
```

### Lint & Format
```bash
npm run lint
npm run format
```

---

## 🏗️ 9. Pipeline Agent Reference

> ⚠️ **Stage numbering:** Stage 6 = Execution+Self-Heal, Stage 7 = Coverage (corrected 2026-08-21).
> Coverage runs AFTER execution so L4 checks work. Skill folder names now equal their Stage
> ID directly (`06-execution-self-heal`, `07-coverage-validation` — renamed 2026-08-21, previously
> swapped relative to their stage numbers). See AGENTS.md reconciliation table.

| Stage | Agent Label | Skill Folder | Description | Key Command |
|-------|-------------|--------------|-------------|-------------|
| 0 | Agent 0 | `00-testdata-environment` | Test Data & Environment | `npm run typecheck` (validates env.ts) |
| 1 | Agent 1 | `01-context-ingestion` | Requirement Ingestion | Manual (paste requirement, run pipeline) |
| 2 | Agent 2 | `02-testcase-design` | Test Case Design (Loop A) | Manual (generates testcases/*.tc.md) |
| 3 | Agent 3 (design) | `03-workflow-design` | Workflow Design | Manual (generates workflows/*.journey.json) |
| 4 | Agent 3 (exec) | `04-live-explorer` | Live Exploration | Manual (browser subagent + verify.json), then `npm run reconcile:workflow -- --story={feature}` |
| 5 | Agent 4 | `05-codegen-pom` | POM Codegen | Manual (generates pages/*.ts + tests/**/*.spec.ts) |
| **6** | **Agent 5** | `06-execution-self-heal` | **Execution & Self-Heal** | `npm run test:b2b` / `npm run test:wishlist` / etc. |
| **7** | **Agent 6** | `07-coverage-validation` | **Coverage Validation** | `npm run qa:coverage` / `npm run qa:coverage:all` |
| 8 | Agent 7 | `08-report-generation` | Report Generation | `npm run report:b2b` / `npm run report:all` / etc. |
| 9 | Loop ∞ | `09-learning-prevention` | Learning & Prevention | Automatic after every run (GAP-006); manual: `npm run sync:memory` then `npm run distill:patterns` |

> **If report shows stale data:** Re-run `npm run report:{feature}` manually once the terminal is idle. The teardown generates the report from whatever `test-results.json` was fresher than `MAX_WAIT_MS`; a manual re-run uses the current file unconditionally.
