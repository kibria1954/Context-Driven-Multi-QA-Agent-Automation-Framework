# 🧠 Knowledge Base — Trusted UI Interaction Patterns & Anti-Patterns

> **Auto-synchronized from `memory/healed-patterns.json` by Stage 9 Learning Loop.**

---

## 📊 Summary Metrics
- **Total Patterns Registered**: 9 (4 interaction, 5 anti-pattern)
- **Trusted Patterns**: 9 (`status: TRUSTED`)
- **Candidate Patterns**: 0 (`status: CANDIDATE`)
- **Last Sync**: `2026-08-21T06:17:05.137Z` 

---

## 🛡️ Trusted Interaction Patterns

| Pattern ID | Component | Selector Pattern | Status | Success Count | Confidence | Interaction Strategy |
|---|---|---|---|---|---|---|
| `PAT-SEL2-001` | Select2 Custom Dropdown | `span.select2-container` | `TRUSTED` | 7 | 99% | click container -> fill search input -> await options -> click active result item |
| `PAT-MODAL-002` | KDN Welcome Overlay Modal | `#kdn-welcome-modal` | `TRUSTED` | 12 | 100% | evaluate DOM removal (#kdn-welcome-modal, .modal-backdrop) -> reset body overflow |
| `PAT-POPUP-003` | Async Multi-Popup Overlay & Don't Show Again Checkbox | `#multi-popup-overlay, input[type='checkbox'][name*='dont-show']` | `TRUSTED` | 15 | 99% | check 'Don't show again' input if present -> count and click visible close buttons -> strip #multi-popup-overlay from DOM -> reset body overflow |
| `PAT-STRICT-004` | Header & Footer Navigation Strict Mode Disambiguation | `a.ico-wishlist.header-link-wishlist, a[href*='wishlist']` | `TRUSTED` | 9 | 100% | append .first() to locator getters in POM classes to resolve strict mode collisions across header/footer links |

---

## ❌ Anti-Patterns (Avoid)

> Distilled from `SETUP_INFRA_ISSUE` / cascading-failure incidents. Always flagged for human review regardless of confidence — see Review Gate in `06-execution-self-heal/SKILL.md`.

| Pattern ID | Component | Status | Confidence | Rule / Safe Alternative | Source Heals |
|---|---|---|---|---|---|
| `ANTI-005` | Comma-Combined Generic + Specific Selectors with .first() | `TRUSTED` | 100% | Never combine a page-specific class/id selector with a generic attribute selector (e.g. button[type="submit"]) in one comma-separated locator when calling .first(). The generic half can match an unrelated element earlier in DOM order. Use the specific selector alone, or scope the generic one to its containing form (e.g. form.login-form button[type="submit"]). | 2026-08-18T11:00:00Z |
| `ANTI-006` | Treating 'No Exception Thrown' as Proof of Success | `TRUSTED` | 100% | Any code that establishes state via a UI action other code depends on (auth login writing storageState, a wizard step advancing, a payment submitting) MUST verify the outcome via an unambiguous signal (session cookie, specific post-action URL, authenticated-only DOM element) before treating it as success. 'Didn't throw' is not proof of success. | 2026-08-18T11:00:00Z |
| `ANTI-007` | Page-Exists Screenshot As Proof of Claimed Backend Effect | `TRUSTED` | 95% | When a requirement claims 'admin sees X data after a customer does Y', Stage 4 (Live Explorer) must perform the write action (Y) first, THEN navigate to the claimed admin page and confirm a row matching that specific record's identifying data is visible — not just that the page loads with plausible column headers. | 2026-08-18T12:30:00Z |
| `ANTI-008` | Fixed-Delay 'Wait for Another Process to Flush' Guards | `TRUSTED` | 95% | Never assume a fixed delay (e.g. setTimeout(r, 1000)) is 'long enough' for another process to finish writing a file this code depends on. Prefer a deterministic check (e.g. compare the JSON reporter's own invocation argv against the current process's argv) polled with a bounded timeout, and log a visible warning if it times out. | 2026-08-18T12:45:00Z |
| `ANTI-009` | Per-Test Timeout Budget Ignoring Nested Browser Contexts | `TRUSTED` | 90% | When a test opens additional browser.newContext()s beyond the primary page fixture (e.g. a withAdminPage()-style helper), Agent 4 (Codegen) must apply test.setTimeout() sized for (primary flow) + (per extra context: navigation + auth-state load + assertions) rather than relying on the suite's blanket default. Agent 5 should treat many different tests failing at the same early step inside a shared multi-context helper as a timeout-budget signal, not diagnose each test's locators independently. | 2026-08-18T13:00:00Z |
