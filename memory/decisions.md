# 📋 Decisions Log — Owner Answers

> Append-only log of all owner decisions. Agents reference this to avoid re-asking the same question.
> When a question from `pending-questions.md` is answered, the decision is recorded here permanently.
> **Format:** `D-NNN — [Topic] — [Date]`

---

## D-001 — Admin ERP Application Location — 2026-08-18

- **Answered At:** `2026-08-18T12:30:00Z`
- **Answered By:** owner (verified via live site investigation)
- **Applied To:** b2b-registration, wholesale-checkout
- **Feature Context:** B2B Registration — REQ-07 (admin visibility)

**Question:** Where does a submitted B2B registration application appear in the admin panel?

**Answer:**
The submitted registration applications appear at `/Admin/ErpAccount/List` — NOT at
`/Admin/ErpRegistrationApplication/List` which was incorrectly assumed from the URL pattern.
The ERP Account list shows customer records that have been registered via the B2B form.
Agent 3 (Live Explorer) MUST navigate to `/Admin/ErpAccount/List` (not the registration list)
to verify admin-side visibility of B2B submissions.

---

## D-002 — Bangladeshi Phone Number Format — 2026-08-18

- **Answered At:** `2026-08-18T11:00:00Z`
- **Answered By:** owner
- **Applied To:** b2b-registration, any feature requiring phone input

**Question:** What phone number format is accepted by the KBD NopCommerce B2B registration form?

**Answer:**
Bangladeshi mobile format: `01X-XXXXXXXX` (11 digits total).
Valid prefixes: 017, 018, 019, 016, 015, 013.
Test data generator: `generateTestPhoneNumber()` in `utils/helpers.ts` produces valid numbers.
The form field `PhoneNumber` accepts strings — no special formatting required beyond the 11 digits.

---

## D-003 — NopCommerce Session Auth Cookie Name — 2026-08-18

- **Answered At:** `2026-08-18T11:00:00Z`
- **Answered By:** owner (verified via browser DevTools during live session)
- **Applied To:** global-setup.ts, verify-auth.ts, all auth-dependent tests

**Question:** What is the name of the NopCommerce authentication session cookie to verify after login?

**Answer:**
The session cookie is named `.Nop.Authentication`.
This is the definitive proof of a valid authenticated session.
`global-setup.ts` MUST check for this cookie in the resulting storageState file after login —
"didn't throw" or "page loaded" is NOT sufficient proof (see ANTI-006 in healed-patterns.json).
`verify-auth.ts` uses this cookie name for pre-flight validation.

---

## D-004 — Staging Base URL — 2026-08-18

- **Answered At:** `2026-08-18T10:00:00Z`
- **Answered By:** owner
- **Applied To:** all stages, playwright.config.ts, envs/staging.md

**Question:** What is the staging environment base URL for KBD NopCommerce?

**Answer:**
Staging: `https://kbd.nop-station.site`
Admin: `https://kbd.nop-station.site/Admin`
This URL is set in `.env.staging` (git-ignored) as `BASE_URL` and `ADMIN_URL`.
Do NOT use production URLs for write-action tests.

---

## D-005 — Select2 Dropdown Interaction Strategy — 2026-08-11

- **Answered At:** `2026-08-11T12:44:00Z`
- **Answered By:** owner (distilled from PAT-SEL2-001 in healed-patterns.json)
- **Applied To:** b2b-registration (company type, country fields), any page with Select2

**Question:** How should agents interact with Select2 custom dropdowns on NopCommerce?

**Answer:**
Do NOT use `.selectOption()` — Select2 replaces native `<select>` with custom spans.
Correct strategy (4 steps):
1. Click `span.select2-container` to open the dropdown
2. Fill the search input inside the dropdown (`.select2-search__field`)
3. Await options to appear (`ul.select2-results__options li.select2-results__option`)
4. Click the active/highlighted result item
This pattern is TRUSTED in PAT-SEL2-001 with successCount=7.

---

## D-006 — Welcome Modal Dismissal Strategy — 2026-08-11

- **Answered At:** `2026-08-11T12:44:00Z`
- **Answered By:** owner (distilled from PAT-MODAL-002)
- **Applied To:** all pages on kbd.nop-station.site (welcome modal appears on first visit)

**Question:** How should the KDN welcome/newsletter overlay modal be dismissed?

**Answer:**
Use DOM removal via `page.evaluate()`:
```javascript
document.querySelectorAll('#kdn-welcome-modal, .modal-backdrop').forEach(el => el.remove());
document.body.style.overflow = '';
document.body.classList.remove('modal-open');
```
The `dismissAllModals()` helper in `utils/helpers.ts` implements this.
ALWAYS call this helper after navigation in tests that aren't specifically testing the modal.

---

## D-007 — Test Data Cleanup Scope — 2026-08-18

- **Answered At:** `2026-08-18T10:30:00Z`
- **Answered By:** owner
- **Applied To:** testdata/ structure, global-teardown.ts, cleanup-check.ts

**Question:** Should test data cleanup delete records from the admin panel, or just log them?

**Answer:**
Log-only for now. The cleanup strategy is:
1. Record synthetic entity identifiers in `testdata/{feature}/cleanup-log.json`
2. After test run, mark them for review — do NOT auto-delete via API (no write-safety cleared for production deletes)
3. Staging: manual cleanup acceptable. Data is synthetic and prefixed `qa-test.*`
4. Production: N/A — production is `write-safe: false`, no test data is ever created there.

---

## D-008 — Pipeline Stage Execution Order — 2026-08-21

- **Answered At:** `2026-08-21T15:00:00Z`
- **Answered By:** owner (via framework review + orchestrator fix)
- **Applied To:** orchestrator.ts, all SKILL.md stage references

**Question:** Should Coverage Validation (Stage 6) run before or after Execution (Stage 7)?

**Answer:**
AFTER. Correct order: `Codegen(5) → Execution(6) → Coverage(7) → Report(8)`.
Coverage at stage 7 can now perform L4 checks (test actually ran in last execution).
The orchestrator was FIXED on 2026-08-21: stage 6 is now Execution, stage 7 is now Coverage.
All SKILL.md references to "Agent 5 = Execution, Agent 6 = Coverage" map to orchestrator
stages 6 and 7 respectively.

---

<!-- New decisions appended here by agents after owner answers questions -->
