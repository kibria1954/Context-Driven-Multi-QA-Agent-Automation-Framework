---
name: 08-report-generation
description: Generate interactive HTML executive dashboard with stakeholder summary, technical deep-dive, bug dedup, cross-feature impact flags, self-heal audit transparency, and pipeline health metrics.
---

# Agent 7 — Reporting Skill

## Overview

Agent 7 aggregates all pipeline data — execution results, coverage matrices, self-heal logs, quarantine status, and trend history — into a comprehensive report with two layers: a **stakeholder-readable summary** (for business people) and a **technical deep-dive** (for engineers). Bug reports are deduped against existing tickets before filing.

> **Golden Rule:** Automation is worthless if only engineers can read the outcome. Every report starts with "what's broken in plain English" before diving into technical detail.

---

## 🛠️ Report Generation Protocol

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

## ✅ Gate Condition
- Report generated with all sections populated.
- Stakeholder summary is plain-language (no jargon).
- Bug reports deduped against known issues.
- Self-heal audit log included.
- Pipeline health metrics calculated.

## ❌ Blocked Conditions
- No test execution results available → Cannot generate report.
- No traceability matrix from Agent 6 → Coverage section empty (generate with warning).
