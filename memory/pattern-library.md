# 🧠 Pattern Library — Distilled Reusable Rules

> Auto-distilled from `heal-log.md` + `decisions.md` + `healed-patterns.json`
> Last distilled: 2026-08-18 (ANTI-005..009 added from a manual incident investigation — see `memory/heal-log.md`)
> Last distillation check: `2026-08-24T11:06:14.387Z` — 0 promotion(s), 0 demotion(s)
> Agents 2, 3, 4, 5 load this file as context on every run.

---

## 🏗️ Architecture Patterns

### PAT-LIB-001: NopCommerce Uses Select2 for Custom Dropdowns
- **Source:** Verified via live exploration of KBD registration form
- **Rule:** Never use standard `<select>` interaction for custom dropdowns. Always use Select2 protocol.
- **Template:** `click span.select2-container → fill search input → await .select2-results__option → click option`
- **Applicable Pages:** register.page.ts

### PAT-LIB-002: Welcome Modal Appears on First Visit
- **Source:** Observed across all first-page-loads on KBD storefront
- **Rule:** Call `dismissAllModals()` after every initial page navigation.
- **Template:** `await dismissAllModals(page)` immediately after `page.goto()`
- **Applicable Pages:** All storefront pages

### PAT-LIB-003: AJAX Loading Spinner Pattern
- **Source:** Observed across form submissions and cart updates
- **Rule:** After any form submission or cart update, wait for `.ajax-loading-block-window` to appear then disappear.
- **Template:** `await waitForAjaxComplete(page)`
- **Applicable Pages:** All pages with form submissions

---

## 📏 Data Patterns

### PAT-LIB-004: BD Phone Number Format
- **Source:** KBD registration requirement REQ-08
- **Rule:** 11 digits, starts with `01`, valid prefixes: `013`, `015`, `016`, `017`, `018`, `019`
- **Template:** `generateBDPhoneNumber()` from `utils/data-provisioner.ts`

### PAT-LIB-005: Test Email Domain
- **Source:** Agent 0 data provisioning standard
- **Rule:** Always use `@qa-test.example.com` domain for test emails. Never use real email domains.
- **Template:** `generateTestEmail(runId)` from `utils/data-provisioner.ts`

---

## ❌ Anti-Patterns (Avoid)

### ANTI-001: XPath as Primary Selector
- **Rule:** Never use XPath as primary selector. Use as T7 (last resort) only.
- **Reason:** XPath selectors break whenever DOM structure changes, even if the target element is unchanged.

### ANTI-002: Fixed Sleep Waits (`page.waitForTimeout`)
- **Rule:** Never use fixed sleeps in generated specs. Use `expect().toBeVisible()` or `waitForURL()`.
- **Reason:** Fixed sleeps are unreliable across environments and waste execution time.

### ANTI-003: Soft `if (isVisible)` Guards on Core Actions
- **Rule:** Never wrap primary user actions in optional visibility checks. Use hard assertions.
- **Reason:** Soft guards create silent false passes — the test reports success even when the element doesn't exist.

### ANTI-004: Inline Selectors in Spec Files
- **Rule:** All selectors MUST live in `utils/selectors.ts`. Never hardcode CSS/XPath in spec files.
- **Reason:** Centralized selectors enable single-point healing and cross-feature impact detection.

### ANTI-005: Comma-Combined Generic + Specific Selectors with `.first()`
- **Source:** `tests/global-setup.ts` admin/customer login — `'button.login-button, button[type="submit"]'.first().click()` silently clicked the storefront header's search button (blank label, `type="submit"`, earlier in the DOM) instead of "Sign In!". The login form was never submitted, no exception was thrown, and the resulting `storageState` was saved as if authenticated.
- **Rule:** Never combine a page-specific class/id selector with a generic attribute selector (`button[type="submit"]`, `input[type="text"]`) in one comma-separated locator when calling `.first()`. The generic half can match an unrelated element anywhere on the page that happens to sit earlier in DOM order. Use the specific selector alone, or scope the generic one to its containing form (`form.login-form button[type="submit"]`).
- **Applies to:** Any selector authored for `utils/selectors.ts` AND any ad-hoc selector in setup/teardown scripts — Agent 5's self-heal only audits `utils/selectors.ts`, so hand-written infra scripts get no equivalent review today (see ANTI-007).

### ANTI-006: Treating "No Exception Thrown" as Proof of Success
- **Source:** Same `global-setup.ts` incident as ANTI-005 — the click succeeded (no error), so the surrounding `try/catch` never fired, and a broken login was saved as a "successful" auth state for every downstream test to silently inherit.
- **Rule:** Any code that establishes state via a UI action that OTHER code depends on (auth login writing `storageState`, a wizard step advancing, a payment submitting) MUST verify the outcome via an unambiguous signal — a session cookie (e.g. `.Nop.Authentication`), a specific post-action URL, or an authenticated-only DOM element — before treating it as success. "The action didn't throw" is not proof it did what was intended.

### ANTI-007: A Page-Exists Screenshot Is Not Proof of a Claimed Backend Effect
- **Source:** REQ-07 (b2b-registration) — Stage 4 live exploration screenshotted `/Admin/ErpRegistrationApplication/List` and marked it the "confirmed real location" for submitted wholesale applications, but the screenshot itself shows **"No records."** The grid never actually receives rows from self-registration — dozens of real test registrations never appeared there. The real location, `/Admin/ErpAccount/List` ("ERP Accounts"), was found only when a human investigated live, not by the pipeline.
- **Rule:** When a requirement claims "admin sees X data after a customer does Y," Stage 4 (Live Explorer) must perform the actual write action (Y) first, THEN navigate to the claimed admin page and confirm a row matching that *specific* record's identifying data (e.g. the exact company name just submitted) is visible — not just that the page loads with plausible column headers. A "confirmed with the project owner" note is not a substitute for an empirical, matching row captured in the DOM/screenshot.

### ANTI-008: Fixed-Delay "Wait for Another Process to Flush" Guards
- **Source:** `tests/global-teardown.ts` — `await new Promise(r => setTimeout(r, 1000))` before reading `reports/generated/test-results.json`, assuming the JSON reporter had finished writing. Under real load 1000ms wasn't always enough; the custom HTML/MD report silently regenerated from a stale prior run's data (once even showing 0% pass immediately after a run that had just passed 100%), with no error or warning surfaced anywhere.
- **Rule:** Never assume a fixed delay is "long enough" for another process to finish writing a file this code depends on. Prefer a deterministic check over a timing guess — e.g. the JSON reporter embeds its own invocation `argv`; comparing that against the current process's own `argv` proves the file is (or isn't) from this run, with no clock-based guessing. Poll for that match with a bounded timeout, and log a visible, actionable warning (not silence) if it times out.
- **Residual limitation (still true after the fix):** in `--headed` runs with `trace`/`video` recording enabled, the JSON reporter's attachment finalization can take 20-30s+ after the last test completes — longer than any reasonable synchronous wait inside `globalTeardown`. The deterministic check makes this *visible* (an honest warning + "run `npm run report` again") instead of *silently wrong*, but doesn't eliminate the possibility. If this becomes frequent, decouple report generation from `globalTeardown` entirely — wire it as a `postXXX` npm script that runs after the whole `npx playwright test` process exits, since Node won't exit while the reporter's file write is still pending.

### ANTI-009: Per-Test Timeout Budget Ignoring Nested Browser Contexts
- **Source:** b2b-registration tests combining a full multi-step registration with a SECOND (sometimes third) freshly-opened admin/login `browser.newContext()` consistently exceeded the 30s default `timeout` in headed mode against the live site. Playwright force-closed the nested context mid-action, producing `"Target page, context or browser has been closed"` — an error that looks like a different bug (browser instability) rather than the real one (insufficient time budget).
- **Rule:** When a test opens additional `browser.newContext()`s beyond the primary `page` fixture (e.g. a `withAdminPage()`-style helper), Agent 4 (Codegen) must apply `test.setTimeout()` sized for (primary flow) + (per extra context: navigation + auth-state load + assertions), not rely on the suite's blanket default. Agent 5 should also recognize many DIFFERENT tests all failing at the exact same early step in a shared multi-context helper as a signal to check the timeout budget and the helper's shared setup — not diagnose each test's locators independently (see `06-execution-self-heal/SKILL.md`'s "Cascading Failure Pattern Recognition" step).
