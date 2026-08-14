---
name: 09-learning-prevention
description: Process test execution outcomes into validated reusable knowledge patterns (Loop C), distill pattern library from heal-log and decisions, version agent prompts, maintain eval regression set, and inject pre-emptive guidance into future pipeline runs.
---

# Learning Loop (∞) — Learning & Prevention Skill (Loop C)

## Overview

The Learning Loop is the cross-cutting intelligence engine that makes the system **genuinely self-learning** — not just self-healing. It processes both Pass and Fail outcomes into a curated pattern library, distills recurring rules from heal logs and owner decisions, versions agent prompts for quality control, and injects pre-emptive guidance into future runs so the same failure never happens twice.

> **Golden Rule:** Without the pattern library, the heal-log is just an audit trail nobody reads. The Learning Loop is what turns "we fixed it once" into "we prevent it every time."

---

## 🔄 Dual-Channel Learning Ingestion

### Pass Outcomes → Stability Signals

From every passing test run, extract:

| Signal | What to Capture | Why It Matters |
|--------|----------------|----------------|
| **Stable selectors** | Selectors that pass consistently across N runs | Candidate for T1/T2 tier promotion |
| **Effective waits** | Wait strategies that never timeout | Should be replicated across similar pages |
| **Form fill sequences** | Order of field fills that works reliably | Some forms have dependency-order issues |
| **DOM patterns** | Consistent DOM structure patterns across pages | Reusable across features |
| **API response shapes** | Stable API contract signatures | Contract drift detection baseline |

### Fail Outcomes → Fragility Signals

From every failing test (including self-healed ones):

| Signal | What to Capture | Why It Matters |
|--------|----------------|----------------|
| **Fragile selectors** | Selectors that changed / broke | Anti-pattern: avoid in future codegen |
| **Timing issues** | Waits that consistently timeout | Increase wait budget for similar elements |
| **Data collisions** | Duplicate entity errors | Namespace strategy for Agent 0 |
| **Modal interference** | Popups blocking test actions | Add to dismissAllModals() handler |
| **State dependencies** | Tests that fail when run out-of-order | Tag as SERIAL_ONLY |

---

## 📈 Pattern Knowledge Lifecycle

```
Raw Execution Event ➔ Candidate Pattern ➔ Lifecycle Validation ➔ Trusted Pattern ➔ Pre-Emptive Knowledge
```

### State Transitions:

| State | Entry Criteria | Exit Criteria |
|-------|---------------|---------------|
| **RAW** | Single observation from one execution run | Observed again in a different run → CANDIDATE |
| **CANDIDATE** | ≥ 2 occurrences across different runs | Validated: $\text{successCount} \ge 3 \land \text{failureCount} = 0 \land \text{confidence} \ge 0.95$ → TRUSTED |
| **TRUSTED** | Pattern validated and stable | Stays TRUSTED until a failure occurs → demote to CANDIDATE |
| **DEPRECATED** | Pattern consistently fails ($\text{failureCount} \ge 3$) | Removed from active injection, kept in archive |

### Promotion Rules:

$$\text{Promote to TRUSTED} = (\text{successCount} \ge 3) \land (\text{failureCount} = 0) \land (\text{confidence} \ge 0.95) \land (\text{crossRunValidated} = true)$$

### Demotion Rules:

$$\text{Demote to CANDIDATE} = (\text{failureCount} \ge 1) \land (\text{status} = \text{TRUSTED})$$

$$\text{Deprecate} = (\text{failureCount} \ge 3) \land (\text{status} = \text{CANDIDATE})$$

---

## 📄 Knowledge Base Schema (`memory/healed-patterns.json`)

```json
{
  "version": "2.0.0",
  "lastUpdated": "{iso-timestamp}",
  "patterns": [
    {
      "patternId": "PAT-001",
      "component": "Select2 Custom Dropdown",
      "category": "widget-interaction",
      "interactionStrategy": "click container → fill search input → await options list → click active option",
      "selectorPattern": "span.select2-container",
      "applicablePages": ["register.page.ts"],
      "applicableFeatures": ["b2b-registration"],
      "successCount": 7,
      "failureCount": 0,
      "confidence": 0.99,
      "status": "TRUSTED",
      "firstObserved": "2026-08-10T12:00:00Z",
      "lastValidated": "2026-08-14T12:30:00Z",
      "promotedAt": "2026-08-11T15:00:00Z",
      "sourceHealIds": ["heal-001", "heal-002"],
      "notes": "NopCommerce uses Select2 for all custom dropdowns. Standard HTML select interaction fails."
    }
  ]
}
```

---

## 📚 Pattern Library Distillation

Periodically (every N runs, or weekly), a distillation job runs:

### Input Sources:
1. `memory/heal-log.md` — What was healed and why
2. `memory/decisions.md` — Owner Q&A pairs and their answers
3. `memory/healed-patterns.json` — Current pattern lifecycle data

### Distillation Process:
1. **Cluster recurring patterns**: "This app always uses X" (e.g., Select2, specific modal patterns)
2. **Extract generalizable rules**: "BD phone numbers are always 11 digits starting with 01"
3. **Identify anti-patterns**: "XPath selectors break every time the page is updated"
4. **Compile into `memory/pattern-library.md`**:

```markdown
# 🧠 Pattern Library — Distilled Reusable Rules

> Auto-distilled from `heal-log.md` + `decisions.md` + `healed-patterns.json`
> Last distilled: {iso-timestamp}

---

## 🏗️ Architecture Patterns

### PAT-LIB-001: NopCommerce Uses Select2 for Custom Dropdowns
- **Source:** 7 successful heals across b2b-registration, wishlist
- **Rule:** Never use standard `<select>` interaction. Always use Select2 protocol.
- **Template:** `click container → fill search → await options → click option`

### PAT-LIB-002: Welcome Modal Appears on First Visit
- **Source:** Every first-page-load across all features
- **Rule:** Call `dismissAllModals()` after every initial navigation.
- **Template:** `await dismissAllModals(page)` after `page.goto()`

---

## 📏 Data Patterns

### PAT-LIB-003: BD Phone Numbers
- **Source:** Owner decision D-001
- **Rule:** 11 digits, starts with 01, prefixes: 013/015/016/017/018/019
- **Template:** `'01' + random(7-8 digits)`

---

## ❌ Anti-Patterns (Avoid)

### ANTI-001: XPath Selectors
- **Source:** 4 `FLAKY_LOCATOR` heals caused by XPath breakage
- **Rule:** Never use XPath as primary selector. T7 only, with T2/T4 fallbacks.

### ANTI-002: Fixed Sleep Waits
- **Source:** 2 `SCRIPT_LOGIC_ERROR` heals caused by timing issues
- **Rule:** Never use `page.waitForTimeout()`. Use `expect().toBeVisible()` or `waitForURL()`.
```

---

## 🛡️ Pre-Emptive Feedback Injection Points

The pattern library and trusted patterns are loaded as context at these pipeline stages:

| Agent | What's Injected | How |
|-------|----------------|-----|
| **Agent 2 (Design)** | Known UI complexities from pattern library | Added to test case preconditions and step descriptions |
| **Agent 3 (Live Explorer)** | Known widget patterns from trusted patterns | Pre-configure handling strategies before exploration |
| **Agent 4 (Codegen)** | Trusted interaction strategies | Generate robust POM methods using proven patterns from day one |
| **Agent 5 (Execution)** | Anti-patterns to avoid | Warn if generated code contains known anti-patterns |

---

## 📋 Agent Prompt Versioning

Each agent's instructions are versioned files:

```
memory/agent-prompts/
├── agent-0-testdata-v1.md
├── agent-1-requirement-v1.md
├── agent-2-testcase-v1.md
├── agent-3-explorer-v1.md
├── agent-4-codegen-v1.md
├── agent-5-execution-v1.md
├── agent-6-coverage-v1.md
├── agent-7-reporting-v1.md
└── loop-c-learning-v1.md
```

**Version Promotion Protocol:**
1. Create new version file (e.g., `agent-2-testcase-v2.md`).
2. Run the new prompt against `memory/eval-regression-set.md`.
3. Compare output quality against known-good baseline.
4. If quality ≥ baseline → promote new version.
5. If quality < baseline → reject, keep current version.

---

## 📊 Eval Regression Set (`memory/eval-regression-set.md`)

Fixed set of known requirements with known-good expected outputs:

```markdown
# Eval Regression Set

## Test Case 1: B2B Registration Requirement → Expected TCs
- **Input:** b2b-registration/parsed.json
- **Expected:** ≥ 10 TCs, covering REQ-01 through REQ-55
- **Quality Gates:** Layer classification present, priority tags present, stakeholder export generated

## Test Case 2: Known Ambiguous Requirement → Expected NEEDS_CLARIFICATION
- **Input:** "Users should be able to do appropriate things as needed"
- **Expected:** Agent 1 flags `NEEDS_CLARIFICATION` — does NOT generate fake criteria

## Test Case 3: Known Locator Change → Expected Heal
- **Input:** TC-003 fails with TimeoutError on #old-button-id
- **Expected:** Agent 5 classifies as FLAKY_LOCATOR, performs semantic verification, patches selector
```

---

## 📄 Output Files
- `memory/healed-patterns.json` (Pattern lifecycle store — updated)
- `memory/healed-patterns.md` (Human-readable pattern sync — auto-generated)
- `memory/pattern-library.md` (Distilled reusable rules — periodically updated)
- `memory/agent-prompts/{agent}-v{n}.md` (Versioned agent prompts)
- `memory/eval-regression-set.md` (Known-good I/O pairs)

## ✅ Gate Condition
- All execution outcomes (pass + fail) processed into pattern lifecycle.
- Pattern promotions/demotions applied.
- Pattern library distilled (if enough new data since last distillation).
- Pre-emptive injection points documented.

## ❌ Blocked Conditions
- No execution results available → Nothing to learn from.
- Memory files corrupted → Rebuild from raw execution logs.
