# 🧠 Pattern Library — Distilled Reusable Rules

> Auto-distilled from `heal-log.md` + `decisions.md` + `healed-patterns.json`
> Last distilled: (not yet distilled — waiting for sufficient data)
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
