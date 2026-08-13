# Context-Driven AI QA Agent — Workspace Operating Guidelines & Agent Rules

## Core Philosophy & Guiding Principle

> **Design intelligently ➔ Validate against reality ➔ Execute reliably ➔ Heal safely ➔ Learn permanently ➔ Prevent the same failure from recurring.**

---

## Core Principles

1. **Strict Stage Hierarchy** — Pipeline MUST proceed sequentially: Stage 1 ➔ Stage 8 (with Stage 9 Learning Loop). No skipping stages.
2. **Grounding Audit Trail** — Source requirements in `context/requirements/<story>/source.md` are immutable. Every run verifies its SHA-256 hash.
3. **No Hallucinations & Traceability** — Requirements containing ambiguous phrasing (`etc.`, `as needed`, `appropriate`) trigger `NEEDS_CLARIFICATION` blocks. Every test case MUST be explicitly linked to a `requirementId`.
4. **Markdown & JSON Artifacts** — Test cases are stored in `.md` for human review, and `.json` for machine processing. Traceability matrix is saved in `memory/traceability/<story>.md`.
5. **Centralized Selectors** — Selectors reside strictly in `utils/selectors.ts`. Never inline selectors in spec files.
6. **Production-Grade 3-Loop Engineering System**:
   - **Loop A (Design-Time)**: Multi-criteria self-critique (Req Coverage + Risk + Business Rules + Boundary Accuracy + Data Validity + Feasibility + Traceability). Context-aware security scope. Max 5 iterations.
   - **DOM / UI Context Layer (Feasibility Bridge)**: Pre-checks dynamic UI widgets (Select2, modals, iframe overlays) between Stage 3 & Stage 5.
   - **Loop B (Execution-Time Safe Healing)**: Multi-factor confidence gate ($\ge 90\% \land \text{Safe Change Type} \land \text{Evidence} \land \text{Regression Passed}$). Supports `NO_SAFE_FIX` escalation and mandatory code rollback. Max 5 healing attempts, 2 evidence retries, 1 regression cycle.
   - **Loop C (Learning & Prevention)**: Pass & Fail outcome processing into pattern lifecycles (`Raw` ➔ `Candidate` ➔ `Validation` ➔ `Trusted Pattern`) stored in `memory/healed-patterns.json` for pre-emptive guidance.
7. **Centralized Command Registry Sync (`COMMANDS.md`)** — Upon completing any new test feature or pipeline stage, ALWAYS update `COMMANDS.md` in the workspace root with all NPM and Playwright commands (defaulting to single-browser visual mode: `--headed --workers=1`).
8. **Strict Skill Template Adherence** — The agent MUST strictly follow the exact markdown templates, JSON schemas, and structural formats defined in `.agents/skills/*` (e.g. per-testcase markdown fields: `Preconditions`, `Steps`, `Expected Result`) without skipping details, substituting simplified tables, or taking shortcuts.
9. **Zero Hallucination & Immediate Client Escalation** — Never invent acceptance criteria, fake selectors, or dummy fallbacks. If any pipeline stage, live site behavior, or requirement encounters unexpected blocking issues, immediately pause and escalate to the client/user for explicit guidance.
10. **Ban Soft `if` Guards on Core Test Actions** — Never wrap primary user actions (entering input, clicking add to cart, proceeding to checkout, order confirmation) in optional `if (await locator.isVisible())` blocks. Core test steps MUST use hard Playwright wait assertions (`await expect(locator).toBeVisible()`). If an element is missing, the test MUST fail explicitly.
11. **Mandatory Live Explorer Pre-Audit (Stage 4 Gate)** — Stage 5 (POM Codegen) MUST NOT run until Stage 4 (Live Explorer) has inspected the live application DOM and documented real selectors, button states, and popup behaviors in `.verify.json`.
12. **Enforce Dual-Factor Assertion Standards** — Every test assertion MUST validate both (a) Target Route / URL path state AND (b) Specific DOM element existence, container state, and non-empty content (e.g. order number, button visibility/invisibility).
13. **Stage 2 Negative Test Hardening** — Negative and edge test specifications in Stage 2 MUST explicitly state exact missing/hidden elements, disabled button states, and error dialog texts.
14. **No Loose / Superficial Assertions** — Loose URL matches (e.g. `toHaveURL(/cart|checkout|kbd/)`) or ungrounded `bodyText.includes(...)` checks are strictly prohibited. Tests must assert exact functional outcome elements.

---

## Pipeline Specification

| Stage | Name | Input | Output | Gate Condition |
|-------|------|-------|--------|----------------|
| **1** | Context Ingestion | Raw Requirement | `parsed.json`, `source.meta.json` | Zero unresolved `NEEDS_CLARIFICATION` items |
| **2** | Test Case Design | `parsed.json` | `<story>.tc.md`, `<story>.tc.json` | Multi-Criteria Loop A Gate Pass (Max 5 iterations) |
| **3** | Workflow Design | `<story>.tc.json` | `<story>.journey.md`, `<story>.journey.json` | All TCs mapped to user journeys |
| **4** | Live Site Verification | `<story>.journey.json` | `<story>.verify.md`, `<story>.verify.json` | DOM Feasibility Bridge verified against live site |
| **5** | POM Code Generation | `<story>.journey.json` | `pages/*.ts`, `tests/e2e/*.spec.ts` | Code uses pre-emptive `healed-patterns.json` & POM |
| **6** | Coverage Validation | `tests/e2e/*.spec.ts` | `memory/traceability/<story>.md` | Every REQ-ID mapped to automated assertion |
| **7** | Execution + Self-Heal | `tests/e2e/*.spec.ts` | `memory/self-heal-log.json`, run status | Suite passes, auto-heals safely, or `NO_SAFE_FIX` rollbacks |
| **8** | Custom Report | Test results + Memory | `reports/generated/<story>-report.html` | Interactive custom HTML report generated |
| **9** | Learning & Memory | Execution Outcomes | `memory/healed-patterns.json` | Pattern lifecycle updated (`TRUSTED` pattern stored) |

---

## Error Taxonomy & Safe Healing Protocol (Stage 7 / Loop B)

| Failure Class | Trigger Pattern | Self-Heal Action | Human Review Required? |
|---------------|-----------------|------------------|-----------------------|
| `FLAKY_LOCATOR` | `TimeoutError`, element not visible | Multi-tier selector fallback update in `utils/selectors.ts` + Anti-Regression Check | No (if Confidence $\ge 90\%$) |
| `SCRIPT_LOGIC_ERROR` | `expect()`, `toHaveText()` mismatch | Fix assertion/step ordering in spec file + Anti-Regression Check | No (if Confidence $\ge 90\%$) |
| `TEST_DATA_ISSUE` | Data constraint failure / duplicate | Dynamic re-seeding generator in `tests/fixtures/test-data/` | No |
| `ENVIRONMENT_ISSUE` | `ECONNREFUSED`, `502`, network error | Quarantine test; schedule retry later | No |
| `UNSAFE_OR_BUSINESS_LOGIC` | Complex business logic / ambiguous error | Transition to `NO_SAFE_FIX`. Escalate immediately. | **YES** |
| `REAL_BUG` | Functional mismatch vs verified journey | **DO NOT SELF-HEAL**. Report bug and quarantine. | **YES** |

