# 🔧 Heal Log — Append-Only Audit Trail

> Every self-heal action recorded with full evidence.
> Source material for Pattern Library distillation (Loop C).
> This file is APPEND-ONLY — never delete entries.

---

<!-- Heal records will be appended below by Agent 5 (Execution & Self-Heal) -->

## Heal Record — 2026-08-18T11:00:00Z

- **Run ID:** `manual-incident-investigation`
- **Test:** All tests reusing `tests/.auth/admin.json` / `tests/.auth/customer.json` (b2b-registration, most of `@regression`)
- **Failure Class:** `SETUP_INFRA_ISSUE` (new class — see `07-execution-self-heal/SKILL.md` addition)
- **Error:** No exception at setup time. Downstream: every admin-page assertion failed as if never logged in (e.g. `TimeoutError: waiting for locator('#SearchEmail')`).
- **Root Cause:** `tests/global-setup.ts` clicked `'button.login-button, button[type="submit"]'.first()` — the storefront header's search submit button (blank label) sits earlier in the DOM than "Sign In!" and matched the generic half of that selector. The login form was never actually submitted; the saved `storageState` had zero real auth cookies.
- **Action:** Narrowed the selector to `'button.login-button'` (unique match) for both admin and customer login; added a post-login check for the `.Nop.Authentication` cookie that throws a descriptive error if absent instead of silently saving a broken state; the 2-hour auth-state cache now also validates for that cookie before trusting a cached file.
- **Semantic Verification:** ✅ Confirmed live — old selector left the browser on `/login`; new selector reaches `/Admin` dashboard with `.Nop.Authentication` present.
- **Confidence:** 100% (root cause reproduced and fix verified live before/after)
- **Anti-Regression:** ✅ TC-001 re-run end-to-end, passed.
- **Auto-Committed:** ⚠️ No — required human review (structural change to shared setup infra, outside Agent 5's current scope; see pattern-library ANTI-005/ANTI-006).

## Heal Record — 2026-08-18T12:30:00Z

- **Run ID:** `manual-incident-investigation`
- **Test:** TC-026, TC-027 (b2b-registration, REQ-07)
- **Failure Class:** `REQUIREMENT_VERIFICATION_ERROR` (new class — see `04-live-explorer/SKILL.md` addition)
- **Error:** `expect(locator).toBeVisible()` failed — application row never found in the grid, even after the timeout-budget fix gave it enough time to load.
- **Root Cause:** REQ-07's "confirmed real location" (`/Admin/ErpRegistrationApplication/List`, set during Stage 4 live exploration) never actually receives rows from self-registration — even the original exploration screenshot (`workflows/b2b-registration/visual/admin-registration-applications.png`) shows "No records." The real location is `/Admin/ErpAccount/List` ("ERP Accounts"), confirmed live with real, searchable rows.
- **Action:** Updated `pages/admin/admin-registration-applications.page.ts`'s `path` to `/Admin/ErpAccount/List`; fixed `ERP_REGISTRATION_SELECTORS.gridSearchInput`/added `gridSearchButton` (previously pointed at a selector — `input[name="SearchCompanyName"]` — that matched nothing on either page); added an actual search-by-account-name step before asserting row visibility (the grid paginates across many prior test runs' accounts).
- **Semantic Verification:** ✅ Confirmed live — searched a known test account's company name, got exactly 1 matching row with correct email.
- **Confidence:** 100% (root cause reproduced and fix verified live)
- **Anti-Regression:** ✅ TC-001, TC-026, TC-027 re-run together, all passed.
- **Auto-Committed:** ⚠️ No — requirement-semantics change requiring human review (Agent 5's `REAL_BUG` class explicitly forbids self-healing when the requirement itself, not the app, is in question).

## Heal Record — 2026-08-18T12:45:00Z

- **Run ID:** `manual-incident-investigation`
- **Test:** N/A (infrastructure — affects report accuracy for every run)
- **Failure Class:** `SETUP_INFRA_ISSUE`
- **Error:** No exception. `reports/generated/*-report.html` regenerated showing stale/wrong pass counts (once showing 0% immediately after a run that had just passed 100%).
- **Root Cause:** `tests/global-teardown.ts` slept a fixed 1000ms hoping the JSON reporter had finished flushing `reports/generated/test-results.json` before regenerating the custom report. Under real load this wasn't always enough.
- **Action:** Replaced the fixed sleep with a poll that waits for the file's mtime to be within a 5s freshness window of teardown's own start (near-zero added latency in the normal case), bounded at 5s total wait.
- **Semantic Verification:** ✅ Re-ran a 3-test suite twice; report now consistently matches Playwright's own console summary.
- **Confidence:** 95% (heuristic-based, not a hard guarantee — see ANTI-008)
- **Anti-Regression:** ✅ Verified across two separate runs.
- **Auto-Committed:** ⚠️ No — required human review (infra script, outside Agent 5's current scope).

## Heal Record — 2026-08-18T13:00:00Z

- **Run ID:** `manual-incident-investigation`
- **Test:** TC-001, TC-003, TC-004, TC-020, TC-026, TC-028, TC-030 (all tests either opening a second/third `browser.newContext()` or doing a full 3-step form submission)
- **Failure Class:** `SETUP_INFRA_ISSUE` (timeout-budget subtype — see ANTI-009)
- **Error:** `Test timeout of 30000ms exceeded` followed by `"Target page, context or browser has been closed"` on whatever action happened to be in flight when Playwright force-killed the test.
- **Root Cause:** The global 30s default `timeout` didn't account for tests that open additional browser contexts (`withAdminPage()`) on top of a multi-step registration flow, especially in `--headed` mode against the live site. Once the auth fix above made the admin flow actually run (rather than fail instantly on a redirect to `/login`), these tests started genuinely needing the time and tipped over the ceiling.
- **Action:** Added `test.setTimeout(60_000)` / `test.setTimeout(75_000)` to the six tests using `withAdminPage()` (sized by how many nested contexts each opens); raised the suite-wide `DEFAULT_TIMEOUT` from 30000 to 45000 in `.env.staging`/`.env.example` since even non-admin full-form-submit tests (TC-020) were observed to brush the old ceiling.
- **Semantic Verification:** ✅ Re-ran affected tests; durations now comfortably inside budget (e.g. TC-028 46.9s inside 75s, TC-020 24-30s inside 45s).
- **Confidence:** 90% (timing-based fixes are inherently probabilistic — see pattern-library ANTI-009 for the structural rule to apply at codegen time going forward)
- **Anti-Regression:** ✅ Re-run TC-001/026/027 together, all passed.
- **Auto-Committed:** ⚠️ No — required human review (`test.setTimeout` calls + env config change).
