# 📊 Eval Regression Set — Known-Good I/O Pairs

> Fixed set of known requirements with known-good expected outputs.
> Used to catch prompt drift when agent instructions are updated.
> Run new prompt versions against these test cases before promotion.

---

## Test Case 1: B2B Registration Requirement → Expected TC Quality

**Input:** `requirements/b2b-registration/parsed.json` (55 REQ-IDs)
**Expected Output Quality Gates:**
- ≥ 10 test cases generated
- All 5 categories represented (positive, negative, edge, boundary, accessibility)
- Layer classification present on every TC (UI or API)
- Priority tags present on every TC (P0, P1, P2)
- Stakeholder export (`*.stakeholder.md`) generated
- Every REQ-ID linked to ≥ 1 TC
- Loop A convergence in ≤ 4 iterations

## Test Case 2: Known Ambiguous Requirement → Expected NEEDS_CLARIFICATION

**Input:** "Users should be able to do appropriate things as needed and other similar actions etc."
**Expected Output:**
- Agent 1 flags `NEEDS_CLARIFICATION`
- Ambiguous keywords identified: `appropriate`, `as needed`, `similar`, `etc.`
- Question appended to `memory/pending-questions.md`
- Agent does NOT generate fake acceptance criteria
- Agent does NOT proceed past Agent 1

## Test Case 3: Known Locator Change → Expected Self-Heal Classification

**Input:** TC-003 fails with `TimeoutError: locator('#old-button-id') — element not found`
**Expected Output:**
- Agent 5 classifies as `FLAKY_LOCATOR` (not `REAL_BUG`)
- Agent re-runs live exploration for the specific element
- New locator candidates captured with tier ranking
- Semantic verification performed (role, text, context match)
- If confidence ≥ 90% → selector patched in `utils/selectors.ts`
- Anti-regression check executed
- Heal evidence recorded in `memory/heal-log.md`

## Test Case 4: Real Bug vs Script Error Differentiation

**Input:** TC-007 expects "Account activated" message but sees "Account pending review"
**Expected Output:**
- Agent 5 classifies as `REAL_BUG` (not `SCRIPT_LOGIC_ERROR`)
- Agent does NOT try to "fix" the test to match the wrong app behavior
- Bug report generated with repro steps, expected vs actual, evidence
- Test quarantined until bug is fixed
- Written to `reports/quarantine/{feature}-bugs.md`

## Test Case 5: Cross-Feature Impact Detection

**Input:** `login.page.ts` modified by self-healing (selector changed)
**Expected Output:**
- Agent 6 reads `memory/page-dependency-index.md`
- Identifies all features using `login.page.ts` (b2b-registration, wishlist-management, wholesale-checkout)
- Flags all features for re-verification
- Impact alert included in Agent 7 report
