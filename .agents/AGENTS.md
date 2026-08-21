# Context-Driven AI QA Agent v2 — Workspace Operating Guidelines & Agent Rules

## Core Philosophy & Guiding Principle

> **Design intelligently ➔ Provision data safely ➔ Validate against reality ➔ Execute reliably ➔ Heal with verification ➔ Learn permanently ➔ Prevent the same failure from recurring ➔ Report honestly.**

---

## 🚦 Mandatory Pre-Flight Protocol (Read This First)

**Any model or agent — not just this session — MUST complete this checklist, in order, before doing any pipeline work in this repo.** Skipping a step here is how the two real incidents below happened: fabricated SHA-256 hashes that silently broke change-detection for months, and coverage matching that cross-contaminated REQ-IDs between features. Neither would have survived this checklist.

1. **Read this file (`AGENTS.md`) in full.** Don't jump straight to a stage's skill file without the master rules — they override anything a skill file doesn't cover.
2. **Identify the feature slug.** Run `npx ts-node scripts/run-pipeline.ts --story={feature}` (see `agents/orchestrator.ts`) and trust its READY / BLOCKED / STALE / ALREADY COMPLETE output over any assumption about what stage comes next.
3. **Never run a stage the orchestrator reports BLOCKED for, and never skip a stage.** If it says stage N is blocked, fix the blocking reason first — don't route around it.
4. **Read the specific `.agents/skills/{NN}-*/SKILL.md` for the stage about to run**, in full, and follow its exact schema (field names, file paths, table structure). Don't improvise a simplified version of the format.
5. **Check `memory/pending-questions.md` for open blocking questions on this feature** before proceeding. If one exists, that's the next thing to resolve — not the stage you were about to run.
6. **Check `memory/pattern-library.md` and `memory/healed-patterns.json` (TRUSTED-status entries) before generating new code or test cases.** Reuse a known-good pattern before inventing a new approach to a problem this system has already solved.
7. **Treat `envs/production.md`'s `write-safe: false` as a hard stop, never a judgment call.** No confidence threshold overrides it. If a task seems to require a write action against production, that's an escalation, not a decision.
8. **Never fabricate data.** SHA-256 hashes, coverage percentages, and selectors must be computed or verified for real — not plausible-looking placeholders. (Real incident: all 3 original features' `source.meta.json` had fabricated hash strings that were never actual SHA-256 output, silently breaking Agent 1's change-detection until caught during a framework audit.)
9. **When a requirement or result is ambiguous, stop and write to `memory/pending-questions.md`.** Do not guess and do not silently pick an interpretation, even a reasonable-sounding one.
10. **After generating or editing any `.ts` file, run `npx tsc --noEmit` before considering the stage done.** A stage isn't complete if the project doesn't typecheck.
11. **Never invent a new file path or schema.** Check this file's "Memory & Knowledge Store Structure" section (below) for the canonical path first — if what you need isn't there, that's a signal to ask, not to freelance a new convention.
12. **Check `memory/decisions.md` before writing to `memory/pending-questions.md`.** If the question has already been answered (search by topic keyword), use that decision directly rather than re-asking the owner.

### 🗂️ Stage → Skill Reconciliation Table (GAP-001 fix, 2026-08-21; skill folders renamed to match stage IDs 2026-08-21)

> Skill folder names now equal their Orchestrator stage ID directly (`06-execution-self-heal` = Stage 6, `07-coverage-validation` = Stage 7 — previously these two folders were swapped relative to their stage numbers, which this table used to have to paper over). The one remaining, intentional mismatch is the conceptual "Agent N" label vs. Stage ID: Agent 3 does double duty across two stages (design at Stage 3, live execution at Stage 4), so every Agent label from Agent 4 onward sits one stage number below its Stage ID. Always use this table when AGENTS.md says "Agent X" and you need the corresponding SKILL.md — the skill folder name is now identical to the Stage column, so the lookup is a single glance.

| AGENTS.md Label | Orchestrator Stage | Skill Folder | Role |
|-----------------|--------------------|----------------------------|--------------------------|
| Agent 0 | Stage 0 | `00-testdata-environment` | Test Data & Environment |
| Agent 1 | Stage 1 | `01-context-ingestion` | Requirement Ingestion |
| Agent 2 | Stage 2 | `02-testcase-design` | Test Case Design (Loop A) |
| Agent 3 (design)| Stage 3 | `03-workflow-design` | Workflow Design |
| Agent 3 (exec) | Stage 4 | `04-live-explorer` | Live Site Verification |
| Agent 4 | Stage 5 | `05-codegen-pom` | POM Code Generation |
| Agent 5 (exec) | **Stage 6** | `06-execution-self-heal` | Execution + Self-Heal |
| Agent 6 (cov) | **Stage 7** | `07-coverage-validation` | Coverage Validation |
| Agent 7 | Stage 8 | `08-report-generation` | Custom Report Generation |
| Loop ∞ | Stage 9 | `09-learning-prevention` | Learning & Memory |

> ⚠️ **CRITICAL:** Stage 6 = Execution, Stage 7 = Coverage. Coverage runs AFTER execution so L4 checks (test actually ran) work correctly. This is the opposite of the earlier pipeline which was incorrect and has been fixed in `agents/orchestrator.ts` (2026-08-21).

---

## Core Principles

1. **Strict Agent Pipeline Hierarchy** — Pipeline MUST proceed sequentially: Agent 0 ➔ Agent 7, with cross-cutting Learning Loop. No skipping agents. Agent 0 (Data & Environment) completes before Agent 3 (Live Explorer) or Agent 5 (Execution) touch any environment.
2. **Grounding Audit Trail** — Source requirements in `requirements/{feature}/source.md` are immutable. Every run verifies its SHA-256 hash. Requirement changes are versioned to `requirements/history/{feature}-v{n}.md`.
3. **No Hallucinations & Traceability** — Requirements containing ambiguous phrasing (`etc.`, `as needed`, `appropriate`, `tbd`, `if applicable`, `reasonable`) trigger `NEEDS_CLARIFICATION` blocks. Every test case MUST be explicitly linked to a `requirementId`.
4. **Markdown & JSON Dual Artifacts** — Test cases stored in `.md` for human review and `.json` for machine processing. Traceability matrix saved in `memory/traceability/{feature}.md`.
5. **Centralized Selectors** — Selectors reside strictly in `utils/selectors.ts`. Never inline selectors in spec files. Each selector entry includes a stability-ranked fallback tier (id > role/label > class > CSS > XPath).
6. **Production-Grade 3-Loop Engineering System**:
   - **Loop A (Design-Time)**: Multi-criteria self-critique (Req Coverage + Risk + Business Rules + Boundary Accuracy + Data Validity + Feasibility + Traceability). Context-aware security scope. Max 5 iterations.
   - **DOM / UI Context Layer (Feasibility Bridge)**: Pre-checks dynamic UI widgets (Select2, modals, iframe overlays) between Agent 3 & Agent 5.
   - **Loop B (Execution-Time Safe Healing)**: Multi-factor confidence gate ($\ge 90\% \land \text{Safe Change Type} \land \text{Semantic Verification} \land \text{Evidence} \land \text{Regression Passed}$). Supports `NO_SAFE_FIX` escalation and mandatory code rollback. Max 5 healing attempts, 2 evidence retries, 1 regression cycle.
   - **Loop C (Learning & Prevention)**: Pass & Fail outcome processing into pattern lifecycles (`Raw` ➔ `Candidate` ➔ `Validation` ➔ `Trusted Pattern`) stored in `memory/healed-patterns.json` for pre-emptive guidance. Periodic pattern library distillation from `memory/heal-log.md` + `memory/decisions.md`.
7. **Centralized Command Registry Sync (`COMMANDS.md`)** — Upon completing any new test feature or pipeline stage, ALWAYS update `COMMANDS.md` in the workspace root with all NPM and Playwright commands (defaulting to single-browser visual mode: `--headed --workers=1`).
8. **Strict Skill Template Adherence** — The agent MUST strictly follow the exact markdown templates, JSON schemas, and structural formats defined in `.agents/skills/*` (e.g. per-testcase markdown fields: `Preconditions`, `Steps`, `Expected Result`) without skipping details, substituting simplified tables, or taking shortcuts.
9. **Zero Hallucination & Immediate Client Escalation** — Never invent acceptance criteria, fake selectors, or dummy fallbacks. If any pipeline stage, live site behavior, or requirement encounters unexpected blocking issues, immediately pause and escalate to the client/user via `memory/pending-questions.md` and chat for explicit guidance.
10. **Ban Soft `if` Guards on Core Test Actions** — Never wrap primary user actions (entering input, clicking add to cart, proceeding to checkout, order confirmation) in optional `if (await locator.isVisible())` blocks. Core test steps MUST use hard Playwright wait assertions (`await expect(locator).toBeVisible()`). If an element is missing, the test MUST fail explicitly.
11. **Mandatory Live Explorer Pre-Audit (Agent 3 Gate)** — Agent 4 (POM Codegen) MUST NOT run until Agent 3 (Live Explorer) has inspected the live application DOM and documented real selectors, button states, and popup behaviors in `.verify.json`.
12. **Enforce Dual-Factor Assertion Standards** — Every test assertion MUST validate both (a) Target Route / URL path state AND (b) Specific DOM element existence, container state, and non-empty content (e.g. order number, button visibility/invisibility).
13. **Negative Test Hardening** — Negative and edge test specifications in Agent 2 MUST explicitly state exact missing/hidden elements, disabled button states, and error dialog texts.
14. **No Loose / Superficial Assertions** — Loose URL matches (e.g. `toHaveURL(/cart|checkout|kbd/)`) or ungrounded `bodyText.includes(...)` checks are strictly prohibited. Tests must assert exact functional outcome elements.
15. **Write-Action Safety Guardrail** — State-changing actions (submit, delete, pay) are ONLY permitted against environments explicitly marked `write-safe: true` in `envs/{env}.md`. This is a **hard stop**, not a confidence threshold. No agent may accidentally act against production.
16. **Test Pyramid Awareness** — UI E2E is the most expensive, most flaky layer. Agent 2 classifies each test case with a **Layer** column (UI/API). API-only validations go to `tests/api/`, not forced through the browser.
17. **Stakeholder-Readable Outputs** — Technical artifacts (test tables, traceability matrices) are the working format, but every report includes a plain-language summary layer for non-technical stakeholders.
18. **Drift-Aware Re-Verification** — The system doesn't only re-check when requirements change on paper. Stable/high-priority features are periodically re-explored via Agent 3 to catch environment drift proactively.
19. **Agent Quality Control** — `.agents/skills/{NN}-*/SKILL.md` **is** the live, current prompt for that stage — there is only one version in effect at a time, and it's the one in that file. `memory/agent-prompts/{agent}-v{n}.md` is NOT a parallel or duplicate set of prompts — it only gets a new file when someone is *proposing a change* to a skill file: snapshot the current `SKILL.md` there before editing, run both the old and new versions against `memory/eval-regression-set.md`, and only overwrite the live `SKILL.md` if the new version's output quality is ≥ the baseline. If it's worse, discard the edit and keep the snapshot as a record of what was tried.
20. **Cross-Feature Impact Detection** — When a page object changes (via Agent 4 codegen or Agent 5 healing), `memory/page-dependency-index.md` is consulted to flag all other features sharing that page for re-verification.

---

## Pipeline Specification (10-Stage + Learning Loop)

| Stage | Agent Label | Name | Input | Output | Gate Condition |
|-------|-------------|------|-------|--------|----------------|
| **0** | Agent 0 | Test Data & Environment | Feature scope | `envs/{env}.md`, `testdata/{feature}/*.json` | Environment validated, test data provisioned, credentials verified |
| **1** | Agent 1 | Requirement Ingestion | Raw Requirement | `requirements/{feature}/parsed.json`, `source.meta.json` | Zero unresolved `NEEDS_CLARIFICATION` items, SHA-256 hash stored |
| **2** | Agent 2 | Test Case Design (Loop A) | `parsed.json` | `testcases/{feature}.tc.md`, `.tc.json`, `.stakeholder.md` | Multi-Criteria Loop A Gate Pass (Max 5 iterations), all REQ-IDs covered |
| **3** | Agent 3 (design) | Workflow Design | `tc.json` | `workflows/{feature}.journey.json` | Journey mapped for all TC flows |
| **4** | Agent 3 (exec) | Live Exploration | `journey.json` | `workflows/{feature}.verify.json`, `visual/*.png` | DOM Feasibility Bridge verified, negative states captured, a11y scanned |
| **5** | Agent 4 | POM Codegen | `journey.json`, `verify.json` | `pages/*.page.ts`, `tests/e2e/*.spec.ts` | Code uses pre-emptive patterns, POM enforced, page-dependency-index updated |
| **6** | Agent 5 | **Execution & Self-Heal (Loop B)** | `tests/e2e/*.spec.ts` | `memory/self-heal-log.json`, `memory/heal-log.md`, run results | Suite passes, heals verified semantically, or `NO_SAFE_FIX` with rollback |
| **7** | Agent 6 | **Coverage & Traceability** | `tests/**/*.spec.ts`, `parsed.json` | `memory/traceability/{feature}.md` | Every REQ-ID at L1+L2+L3+L4, cross-feature impact checked |
| **8** | Agent 7 | Reporting | Test results + Memory + Coverage | `reports/generated/{feature}-report.html` | Interactive report with stakeholder summary, deduped bugs, heal audit |
| **9** | Loop ∞ | Learning & Prevention (Loop C) | Execution Outcomes | `memory/healed-patterns.json`, `memory/pattern-library.md` | Pattern lifecycle updated, distilled rules injected into future runs |

---

## Orchestrator Specification

### Stage Order & Gates
- Agent pipeline is strictly sequential: `0 → 1 → 2 → 3 → 4 → 5 → 6 (Execution) → 7 (Coverage) → 8 → 9`, with Learning Loop (`∞`) after Stage 8.
- Agent 0 MUST complete before Agents 3 or 5 interact with any environment.
- **IMPORTANT:** Stage 6 = Execution, Stage 7 = Coverage — coverage runs AFTER execution so real execution results feed L4 coverage checks.
- **Recommended human approval gates**: After Stage 2 (Test Case Design, before automation effort), and before Stage 6 (Execution against live environment).
- Everything else runs autonomously unless confidence drops below threshold.

### Feature-Level Re-Runs
- When Agent 1 detects a requirement change (SHA-256 diff), the orchestrator re-triggers ONLY affected downstream agents for that feature — not the whole pipeline for every feature.
- Cross-feature re-verification (Stage 7 Coverage) runs additionally when a shared page object changes.

### Delta-Only Processing
- Changed requirements trigger downstream re-processing only for the delta, not from scratch.
- Unchanged REQ-IDs keep their existing test cases, journeys, and specs.

---

## Error Taxonomy & Safe Healing Protocol (Agent 5 / Loop B)

$$\text{Auto-Heal Trigger} = (\text{Confidence} \ge 90\%) \land (\text{Safe Change Type}) \land (\text{Semantic Verification}) \land (\text{Strong Evidence}) \land (\text{Anti-Regression Passed})$$

| Failure Class | Trigger Pattern | Self-Heal Action | Human Review Required? |
|---------------|-----------------|------------------|-----------------------|
| `FLAKY_LOCATOR` | `TimeoutError`, element not visible | Multi-tier selector fallback update in `utils/selectors.ts` + **Semantic verification** (confirm new locator matches role/text/context of original) + Anti-Regression Check | No (if Confidence $\ge 90\%$ AND semantic match) |
| `SCRIPT_LOGIC_ERROR` | `expect()`, `toHaveText()` mismatch | Fix assertion/step ordering in spec file + Anti-Regression Check | No (if Confidence $\ge 90\%$) |
| `TEST_DATA_ISSUE` | Data constraint failure / duplicate | Dynamic re-seeding via `utils/data-provisioner.ts` with tagged cleanup | No |
| `ENVIRONMENT_ISSUE` | `ECONNREFUSED`, `502`, network error | Quarantine test in `memory/flaky-quarantine.md`; schedule retry later | No |
| `UNSAFE_OR_BUSINESS_LOGIC` | Complex business logic / ambiguous error | Transition to `NO_SAFE_FIX`. Escalate immediately via `memory/pending-questions.md`. | **YES** |
| `REAL_BUG` | Functional mismatch vs verified journey | **DO NOT SELF-HEAL**. Report bug with repro steps, quarantine test. | **YES** |
| `SETUP_INFRA_ISSUE` | ≥3 unrelated failures tracing to shared infrastructure | Fix the ONE infra script after cascading pattern check; always flag for human review | **YES** |
| `REQUIREMENT_VERIFICATION_ERROR` | verify.json points to wrong admin URL / data location | DO NOT fix test spec. Re-investigate admin location, update verify.json, escalate to owner. | **YES** |

### Anti-Regression & Rollback Protocol
1. Before committing any heal, run all dependent spec files in headless mode.
2. If healed fix fails regression or retry → **immediate rollback** to original code.
3. `NO_SAFE_FIX` state preserves original code and escalates with full context.

### Review Gate on Healed Code
- **Single locator swap** with high confidence + semantic match → auto-commit.
- **Multiple locators, structural changes, or lower confidence** → flag for human review, do not auto-merge.

### Flaky Quarantine
- Test recurring as flaky across 2+ runs → quarantine in `memory/flaky-quarantine.md`.
- Quarantined tests stop blocking the pipeline but remain tracked for real fixes.
- Agent 6 reports quarantined-flaky count as a coverage gap signal.

### Hard Circuit Breaker Limits
- **Healing Attempts**: Max 5
- **Evidence Retries**: Max 2
- **Regression Impact Cycle**: Max 1
- If limits reached: STOP → Rollback → Escalate to human review.

---

## Security & Environment Policy

- Live Exploration (Agent 3) and Execution (Agent 5) may only run write-actions against environments flagged `write-safe: true` in `envs/{env}.md` — staging/test by default, never production.
- Credentials are NEVER written into generated test files, logs, screenshots, or `heal-log.md`. Reference by name (`process.env.QA_TEST_USER`), resolve at runtime.
- Test data containing anything resembling real PII must be synthetic — Agent 0 generates fake data, never pulls from production.
- Screenshots/videos captured during exploration or failure are scanned for obvious secrets (tokens, card numbers) before being stored, and masked if found.
- All `.env*` files are git-ignored. Only `.env.example` (with placeholder values) is committed.

---

## CI/CD Integration

- **Fast Tier (every commit):** API-layer specs + P0 UI smoke subset. Target: < 5 minutes.
- **Full Tier (nightly / pre-release):** Full UI matrix across browsers/viewports, full regression set — sharded across parallel CI workers.
- Pipeline gates merge on fast tier only; full tier failures notify but don't block, routing failures into Agent 5's classification.
- Every CI run writes to `results/{feature}-run-{n}.json` exactly as a local run would — no separate reporting path.

---

## Cost & Token Budget Guardrails

- Per-feature run budget (LLM calls + loop iterations) tracked and logged.
- If Loop A or Loop B consistently hits its iteration cap → escalate (ambiguity signal), don't let costs creep silently.
- **Cheap/fast model**: Parsing, formatting, classification tasks (Agent 1 ingestion, Agent 6 matrix-building).
- **Strong model**: Test-design reasoning (Agent 2) and failure triage (Agent 5).
- Full cross-browser/viewport runs reserved for P0 test cases and nightly full-tier runs, not every commit.

---

## Pipeline Health Metrics

Track over time, surfaced in `reports/`:
- Self-heal success rate (heals that stayed fixed vs re-broke within N runs), split by auto-committed vs PR-reviewed.
- False-positive bug rate (bugs filed by Agent 7 that were closed as "not a bug").
- Flaky-quarantine list size and average time-to-real-fix.
- Requirement-to-test-case turnaround time, and how often Loop A hits its cap (ambiguity signal).
- Coverage trend per feature over successive requirement versions.
- Accessibility findings trend (new vs resolved) from `memory/a11y-findings.md`.
- Pattern library growth rate and trusted-pattern utilization in codegen.

---

## Owner Escalation & Governance

- Every agent: if confidence is below threshold or input is ambiguous/contradictory → **stop and ask** in plain language. Question appended to `memory/pending-questions.md` via `escalateToOwner()` (`utils/escalation-helpers.ts`) and owner pinged via chat.
- Once answered, **run `npx ts-node scripts/resolve-question.ts --id=Q-... --answer="..." --applied-to=feature1,feature2`** (or call `resolvePendingQuestion()` directly). This is the ONLY sanctioned way to record an answer — it flips the question's status in `pending-questions.md` to `✅ ANSWERED` AND appends the entry to `memory/decisions.md` in one step (GAP-005 fix, 2026-08-21). Do not hand-edit `decisions.md` directly — a hand-edit that forgets to also flip the question's status leaves `hasOpenQuestions()` still blocking the stage even though the answer is recorded, and a hand-edit to `pending-questions.md` alone leaves the answer undiscoverable to future agents (this is exactly how `decisions.md` went empty for weeks despite real questions being answered in chat).
- Owner role is treated as a role (not hardcoded name) so adding a second approver later is trivial.
- Agent prompts are versioned (`memory/agent-prompts/{agent}-v{n}.md`) and regression-tested against `memory/eval-regression-set.md` before promotion.

---

## Memory & Knowledge Store Structure

```
/envs/{env}.md                              (Environment manifests — Agent 0)
/testdata/{feature}/*.json                   (Synthetic test data — Agent 0)
/requirements/{feature}.md                   (Structured requirement spec — Agent 1)
/requirements/{feature}/parsed.json          (Atomic REQ-ID clauses — Agent 1)
/requirements/{feature}/source.md            (Raw immutable input — Agent 1)
/requirements/{feature}/source.meta.json     (SHA-256 hash, version — Agent 1)
/requirements/history/{feature}-v{n}.md      (Archived requirement versions — Agent 1)
/testcases/{feature}.tc.md                   (Human-readable test cases — Agent 2)
/testcases/{feature}.tc.json                 (Machine-readable test cases — Agent 2)
/testcases/{feature}.stakeholder.md          (Plain-language TC export — Agent 2)
/workflows/{feature}.journey.md              (User journey flows — Agent 2/3)
/workflows/{feature}.journey.json            (Machine journey data — Agent 2/3)
/workflows/{feature}.verify.md               (DOM verification log — Agent 3)
/workflows/{feature}.verify.json             (DOM verification data — Agent 3)
/workflows/{feature}/visual/*.png            (Visual baselines — Agent 3)
/pages/{page}.page.ts                        (Page Object classes — Agent 4)
/utils/selectors.ts                          (Centralized selector registry — Agent 4/5)
/tests/e2e/{feature}/*.spec.ts               (UI-layer specs — Agent 4)
/tests/api/{feature}/*.spec.ts               (API-layer specs — Agent 4)
/results/{feature}-run-{n}.json              (Execution results — Agent 5)
/memory/traceability/{feature}.md            (Coverage matrix — Agent 6)
/reports/generated/{feature}-report.html     (Executive dashboard — Agent 7)
/reports/generated/{feature}-report.md       (Markdown report — Agent 7)
/reports/quarantine/{feature}-no-safe-fix.md (Escalation reports — Agent 5)
/memory/heal-log.md                          (Append-only: what healed, why, evidence)
/memory/decisions.md                         (Append-only: every owner Q&A)
/memory/pending-questions.md                 (Live: current open questions — owner dashboard)
/memory/flaky-quarantine.md                  (Quarantined flaky tests)
/memory/pattern-library.md                   (Distilled reusable rules from heal-log + decisions)
/memory/page-dependency-index.md             (Which features use which shared page objects)
/memory/a11y-findings.md                     (Accessibility scan results, non-blocking backlog)
/memory/known-bugs.md                        (Filed bug tickets — Agent 7 dedup lookup before filing new ones)
/memory/convergence/{feature}.json           (Loop A iteration/convergence history — one file per feature)
/memory/healed-patterns.json                 (Pattern lifecycle store — interaction + anti-pattern entries; keep in sync with heal-log.md, see 09-learning-prevention/SKILL.md)
/memory/healed-patterns.md                   (Human-readable pattern sync)
/memory/self-heal-log.json                   (Execution audit log — machine-readable twin of heal-log.md; report generation reads ONLY this file. Sync via appendSelfHealLogEntry() or `npm run sync:memory`.)
/memory/context-store.json                   (Feature knowledge store)
/memory/agent-prompts/{agent}-v{n}.md        (Versioned agent prompts)
/memory/eval-regression-set.md               (Known-good I/O pairs for prompt drift detection)
```
