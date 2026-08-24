---
name: 08-report-generation
description: Generate interactive HTML executive dashboard with stakeholder summary, technical deep-dive, bug dedup, cross-feature impact flags, self-heal audit transparency, and pipeline health metrics.
---

# Agent 7 — Reporting Skill

## Overview

Agent 7 aggregates all pipeline data — execution results, coverage matrices, self-heal logs, quarantine status, and trend history — into a comprehensive report with two layers: a **stakeholder-readable summary** (for business people) and a **technical deep-dive** (for engineers). Bug reports are deduped against existing tickets before filing.

> **Golden Rule:** Automation is worthless if only engineers can read the outcome. Every report starts with "what's broken in plain English" before diving into technical detail.

---

## 📁 Files to Load

- **This file** (full read).
- `reports/generated/test-results.json`, `memory/self-heal-log.json`, `memory/traceability/{feature}.json`, `memory/flaky-quarantine.md`, `memory/run-history/` — all read via `utils/report-helpers.ts::buildReportData()`, don't hand-parse these yourself.
- `memory/known-bugs.md` — dedup check before filing a new bug.
- **Don't load:** `SKILL.md` files for other stages, or `utils/selectors.ts`/`pages/*.page.ts` — reporting only aggregates already-produced data, it doesn't inspect source.

## ⚠️ Common Mistakes

- **Generating the report from `tests/global-teardown.ts` (or anything else that runs as a `globalTeardown` hook) instead of from a Reporter's `onEnd()`.** Section 0 exists because of this — read it before touching report generation at all. This is not a timing-tuning problem; it is structurally impossible to fix from globalTeardown, so if you find yourself adding/adjusting a delay or poll there, stop and re-read Section 0.
- **Invoking Playwright with a CLI `--reporter=...` override while relying on the custom dashboard to regenerate.** `--reporter=list` (or any `--reporter=` flag) *replaces* the entire `reporter: [...]` array from `playwright.config.ts` for that invocation — `json` and `reporters/custom-report-reporter.ts` simply never run, and the dashboard silently keeps showing whatever the last full-reporter-array run produced. Hit this personally while verifying the Section 0 fix: two `--reporter=list` runs in a row left the dashboard on days-old data with no error or warning. Use the project's `npm run test:*` scripts (or a bare `npx playwright test <spec>`) when the dashboard needs to reflect the run — never add `--reporter=` to those.
- **Recomputing a second, weaker traceability matrix** instead of reading `memory/traceability/{feature}.json` (Agent 6's single source of truth) — a past version of this codebase did exactly this and it drifted from the real matrix.
- **Filing a duplicate bug ticket** without checking `memory/known-bugs.md` / existing tickets first (Section 6).
- **Burying the plain-language summary below the technical tables.** It goes first, always — that's the whole point of Section 1.
- **Writing a second, differently-shaped run-history entry** instead of using `recordRunHistory()` (`utils/report-helpers.ts`) — a duplicate writer with an incompatible schema previously polluted the trend chart with false zero-value data points (GAP-011 incident). `recordRunHistory()` is the only sanctioned writer.
- **Checking `e.coverageStatus === 'covered'` instead of `e.flag === 'FULLY_COVERED'` when reading traceability data.** (Real incident, 2026-08-24) `scripts/validate-coverage.ts` writes a `flag` field with values like `FULLY_COVERED`, `TC_ONLY`, `UNCOVERED` — it does NOT write a `coverageStatus` field. A prior version of `utils/report-helpers.ts` checked the wrong field name with the wrong value, silently showing "0% COVERED / ❌ UNCOVERED" for every REQ-ID in the b2b-registration report despite 100% actual coverage. Always use `entry.flag === 'FULLY_COVERED'` (or `|| 'TC_ONLY'`) to determine covered status.
- **Showing all features' self-heal entries in every report.** `memory/self-heal-log.json` is global — it contains entries for ALL features. When generating a feature-specific report, filter by `entry.storyName === storyName`. A prior version showed 4 b2b-registration heal entries on the wishlist report where none belonged.
- **Allowing run-history entries without a `story` field to pass the feature filter.** Early runs didn't write a `story` field. The previous filter `!entry.story || entry.story === storyName` let those entries through into every feature's trend chart, creating ghost data points with misleading pass rates. Use strict matching: `entry.story === storyName` — entries without a story field are excluded.

## ✅ Gate Condition (check before starting, and again before marking this stage done)
- Data freshness verified before generation (Section 0) — not assumed from a fixed delay.
- Report generated with all sections populated.
- Stakeholder summary is plain-language (no jargon).
- Bug reports deduped against known issues.
- Self-heal audit log included.
- Pipeline health metrics calculated.

## ❌ Blocked Conditions
- No test execution results available → Cannot generate report.
- No traceability matrix from Agent 6 → Coverage section empty (generate with warning).

---

## 🛠️ Report Generation Protocol

### 0. Data Freshness Gate — solved structurally, not by polling

**Incident (2026-08-18):** `tests/global-teardown.ts` slept a fixed 1000ms hoping Playwright's JSON reporter had finished flushing `reports/generated/test-results.json`, then generated the report. Under real load that wasn't always enough — the report silently regenerated from a stale prior run's data, once showing 0% pass immediately after a run that had actually passed 100%.

**Follow-up incident (2026-08-24), same root cause wearing a smarter disguise:** the fixed sleep was replaced with a bounded poll in `global-teardown.ts` that compared the JSON file's embedded `config.argv` against the current run's argv, up to 30s, warning and proceeding on timeout. It still produced a wrong report — a wishlist run that passed 17/18 got reported as "0% (0/1 Passed)". The poll wasn't losing a race, it was waiting for something that had not started yet. Traced into `node_modules/playwright/lib/runner/index.js`: `globalTeardown` runs as a `teardown` step inside the global-setup task stack, and `runTasks()`'s `finishTaskRun()` only calls `reporter.onEnd()` on **any** reporter *after* that whole task stack (including globalTeardown) has finished unwinding (`await taskRunner.run(...)` completes, *then* `await testRun.reporter.onEnd(...)`). So `globalTeardown` can never observe the JSON reporter's finished file — not intermittently, structurally never, for any Playwright version with this task-stack architecture. No amount of polling from that hook fixes it.

**The actual fix:** report generation now lives in `reporters/custom-report-reporter.ts`, a real Playwright `Reporter` with an `onEnd()` hook, registered in `playwright.config.ts`'s `reporter: [...]` array **after** `['json', ...]`. Playwright's reporter dispatcher calls each registered reporter's `onEnd()` in array order and `await`s it before invoking the next one — a structural guarantee, not a timing heuristic — so by the time this reporter's `onEnd()` runs, `reports/generated/test-results.json` is unconditionally fully written. `tests/global-teardown.ts` keeps only work that doesn't depend on reporter output (screenshot retention cleanup, Loop C distillation trigger).

If you are about to touch report generation:
1. **Do not move it back into `globalTeardown`**, and do not add a delay/poll there "just to be safe" — re-read the paragraph above first; it is not fixable from that hook.
2. Keep `reporters/custom-report-reporter.ts` positioned **after** `json` (and any other reporter whose output it reads) in `playwright.config.ts`'s array. Reordering silently reintroduces the exact same race.
3. **When manually verifying a change to this pipeline, never invoke Playwright with a CLI `--reporter=` override** (e.g. `--reporter=list`) — that flag replaces the config's entire `reporter: [...]` array for that invocation, so `json` and the custom reporter simply don't run, and the dashboard quietly keeps showing an old run's data with zero indication anything is wrong. Verify with the project's `npm run test:*` scripts or a bare `npx playwright test <spec>` (no `--reporter` flag) — that's the only way to exercise the same reporter chain a real run uses. If you need Playwright's own live progress in the terminal *and* the custom dashboard, add `list` inside the config's array (it's already there) rather than overriding via the CLI.
4. If a discrepancy between the terminal's own pass/fail summary and the generated dashboard ever resurfaces, that is a sign this guarantee broke (wrong reporter order, a `--reporter=` override somewhere in the invocation, or a new Playwright version changing task-stack ordering) — don't just re-add a poll, find which of those three it is.

### 1. Stakeholder Summary (Top of Report)

The first section of every report is a plain-language summary:

```markdown
## 📋 Executive Summary — {Feature Name}

### What We Tested
{1-2 sentence description of the feature and what was validated.}

### Results at a Glance
- ✅ **{N} tests passed** — Core functionality is working
- ❌ **{N} tests failed** — {Brief description of what's broken}
- ⚠️ **{N} tests quarantined** — Known flaky tests excluded from gating
- 🔧 **{N} issues auto-healed** — Test infrastructure fixes applied automatically

### What's Working
- {Business-language description of passing scenarios}

### What's Broken (Action Required)
- {Business-language description of failures with impact}
- **Severity:** {Critical / High / Medium / Low}
- **Impact:** {What users will experience if this ships}

### Recommendations
- {What the team should do about the findings}
```

### 2. Test Execution Summary Grid

```html
<!-- Metric cards with pass/fail/skip/quarantine counts -->
<!-- Color-coded pass rate badge (≥90% Green, 70-89% Yellow, <70% Red) -->
<!-- Progress bar visualization -->
```

### 3. Test Execution Breakdown Table

| TC-ID | Name | Type | Layer | Priority | Status | Duration | REQ-ID |
|-------|------|------|-------|----------|--------|----------|--------|

### 4. Scenario Type & Layer Breakdown

| Category | Count | Pass Rate |
|----------|-------|-----------|
| Positive (UI) | {n} | {n}% |
| Positive (API) | {n} | {n}% |
| Negative (UI) | {n} | {n}% |
| Edge (UI) | {n} | {n}% |
| Boundary (API) | {n} | {n}% |

### 5. Coverage Summary

From Agent 6's traceability matrix:
- Overall coverage %
- Effective coverage % (excluding quarantined)
- Coverage by priority (P0/P1/P2)
- Uncovered REQ-IDs (if any)

### 6. Bug Report Section (Deduped)

For failures classified as `REAL_BUG` by Agent 5:

**Before filing a new bug:**
1. Search existing tickets (via issue tracker MCP if available, or `memory/known-bugs.md`) for:
   - Same REQ-ID + same error signature
   - Same page + same failure pattern
2. If match found → **Comment on existing ticket** instead of filing duplicate.
3. If no match → Generate new bug report:

```markdown
### 🐛 BUG — {Brief Title}

- **Severity:** Critical | High | Medium | Low
- **REQ-ID:** REQ-XX
- **TC-ID:** TC-XXX
- **Feature:** {feature-slug}

**Repro Steps:**
1. {Exact step from executed test — not re-typed, pulled from test execution log}
2. {Step 2}
3. {Step 3}

**Expected:** {From verified journey / requirement}
**Actual:** {From test execution result}

**Evidence:**
- Screenshot: `screenshots/{feature}-{tc-id}-{timestamp}.png`
- Trace: `test-results/{trace-file}`

**Environment:** {env name, URL, timestamp}
```

### 7. Self-Heal Audit Log Section

Full transparency on what Agent 5 changed automatically:

| Timestamp | Test | Failure Class | Old Value | New Value | Confidence | Semantic Match | Regression | Auto-Committed |
|-----------|------|--------------|-----------|-----------|------------|----------------|------------|----------------|

> **Purpose:** Nothing "fixes itself" invisibly. Every auto-heal is documented and reviewable.

### 8. Cross-Feature Impact Flags

From Agent 6's impact check:

```markdown
### ⚠️ Cross-Feature Impact Alerts
- `login.page.ts` was modified by self-healing → Affects: b2b-registration, wishlist-management, wholesale-checkout
- **Recommendation:** Re-run verification for affected features
```

### 9. Quarantine Section

```markdown
### 🔶 Quarantined Tests
| Test | Feature | In Quarantine Since | Days | Root Cause | Action Needed |
|------|---------|---------------------|------|------------|---------------|
```

### 10. Trend Analysis

Historical data from `memory/run-history/`:
- Pass rate over time (last 10 runs)
- Self-heal rate trend
- Quarantine list growth/shrinkage
- Coverage trend per feature

### 11. Pipeline Health Metrics

```markdown
### 📊 Pipeline Health Dashboard

| Metric | Current | Trend (30d) |
|--------|---------|-------------|
| Self-Heal Success Rate | {n}% | ↑ / ↓ / → |
| False-Positive Bug Rate | {n}% | ↑ / ↓ / → |
| Quarantine List Size | {n} tests | ↑ / ↓ / → |
| Avg Req-to-TC Turnaround | {n} min | ↑ / ↓ / → |
| Loop A Avg Iterations | {n} | ↑ / ↓ / → |
| Coverage Trend | {n}% | ↑ / ↓ / → |
| a11y Findings (Open) | {n} | ↑ / ↓ / → |
| Pattern Library Size | {n} trusted | ↑ / ↓ / → |
```

---

## 🎨 HTML Dashboard Design

The HTML report follows the existing glassmorphic dark-mode design from `scripts/generate-report.ts`, enhanced with:

- **Stakeholder summary section** at the very top (business language)
- **Layer and priority breakdown grids**
- **Self-heal audit accordion** (expandable per heal entry)
- **Cross-feature impact alert banner** (yellow warning if impact detected)
- **Trend sparkline charts** (pass rate, quarantine size over time)
- **Bug report cards** with severity badges
- **Interactive table sorting** (click column headers to sort)

### Color Palette:
```css
:root {
  --bg-primary: #0f172a;    --bg-secondary: #1e293b;
  --success: #10b981;       --danger: #ef4444;
  --warning: #f59e0b;       --info: #06b6d4;
  --accent: #3b82f6;        --purple: #a855f7;
}
```

---

## 📄 Output Files
- `reports/generated/{feature}-report.html` (Interactive HTML executive dashboard)
- `reports/generated/{feature}-report.md` (Markdown summary report with stakeholder section)
- `reports/generated/test-results.json` (Raw Playwright JSON output)

`npx ts-node scripts/generate-report.ts --story={feature}` runs one feature; `--all` (or `npm run report:all`) auto-discovers every feature with a `requirements/{feature}/parsed.json` and generates all of their reports in one pass (GAP-003). This CLI path is for manual/ad-hoc regeneration only — every normal test run regenerates the report automatically via `reporters/custom-report-reporter.ts` (see Section 0), so you should not need to run this by hand after a routine `npm run test:*`.

_(Gate Condition and Blocked Conditions are listed near the top of this file, before the protocol — check them first.)_
