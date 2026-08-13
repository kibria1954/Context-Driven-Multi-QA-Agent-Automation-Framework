---
name: 07-execution-self-heal
description: Execute Playwright test suites and perform automated Loop B self-healing based on 5-class error taxonomy.
---

# Stage 7 — Execution & Safe Self-Healing Skill (Loop B)

## Overview
Stage 7 executes the automated Playwright test suite, reads failure stack traces and screenshots silently, classifies errors according to the **Error Taxonomy**, and performs automated self-healing updates using a **Multi-Factor Safety Gate**.

## 🌐 Single Browser Execution Requirement
All visual headed test execution commands MUST include `--headed --workers=1` to enforce single-browser sequential execution (e.g., `npx playwright test <spec> --headed --workers=1`), allowing clean visual observation without spawning multiple browser windows simultaneously.

---

## 🛠️ Multi-Factor Healing & Error Taxonomy

$$\text{Auto-Heal Trigger} = (\text{Confidence} \ge 90\%) \land (\text{Safe Change Type}) \land (\text{Strong Evidence}) \land (\text{Anti-Regression Passed})$$

| Failure Class | Trigger Pattern | Automated Self-Heal Action | Human Review Required? |
|---|---|---|---|
| `FLAKY_LOCATOR` | `TimeoutError`, element not visible | Multi-tier selector fallback update in `utils/selectors.ts` + Anti-Regression Check | No (if Confidence $\ge 90\%$) |
| `SCRIPT_LOGIC_ERROR` | `expect()`, `toHaveText()`, strict mode | Fix step ordering / assertion pattern + Anti-Regression Check | No (if Confidence $\ge 90\%$) |
| `TEST_DATA_ISSUE` | Dynamic constraint / duplicate entry | Auto-reseed dynamic timestamp / UUID generator in `tests/fixtures/test-data/` | No |
| `ENVIRONMENT_ISSUE` | `ECONNREFUSED`, `502 Bad Gateway` | Quarantine test scenario; schedule retry later | No |
| `UNSAFE_OR_BUSINESS_LOGIC` | Business logic change / ambiguous error | Transition to `NO_SAFE_FIX`. Escalate immediately. | **YES** |
| `REAL_BUG` | Functional mismatch vs verified journey | **DO NOT SELF-HEAL**. Escalate immediately with detailed bug report. | **YES** |

---

## 🛡️ Anti-Regression Guard & Mandatory Rollback Protocol

1. **Anti-Regression Check**: Before committing any self-heal patch to `utils/selectors.ts` or `pages/*.ts`, the agent executes all **dependent spec files** in headless mode.
2. **`NO_SAFE_FIX` State**: If failure root cause is understood but cannot be modified with high confidence or without business logic mutation, transition to `NO_SAFE_FIX` and preserve code.
3. **Mandatory Rollback**: If a healed fix fails the anti-regression check or fails upon retry, execute an immediate `git checkout` / rollback to restore original code integrity.

### 🛑 Hard Circuit Breaker Iteration Limits
- **Healing Attempts**: Max 5 attempts
- **Evidence Retries**: Max 2 retries
- **Regression Impact Cycle**: Max 1 impact cycle
- *If limits are reached: STOP ➔ Rollback to original state ➔ Escalate to human review report.*

---

## 📄 Output Files & Escalation Artifacts
- `memory/self-heal-log.json` (Execution audit log of failure classifications, confidence scores, and edits)
- `reports/quarantine/<story>-no-safe-fix.md` (Human escalation report for `NO_SAFE_FIX` & `REAL_BUG` items)
- `reports/generated/<story>-report.html` (Executive HTML dashboard with highlighted escalation alerts)
- `reports/generated/test-results.json` (Raw Playwright test result output)

