---
name: 05-codegen-pom
description: Generate Playwright TypeScript test specs and Page Objects with POM pattern, centralized selectors, UI/API layer split, session handling, dynamic waits, traceability headers, and shared-page dependency registration.
---

# Agent 4 — Automation Codegen Skill (POM)

## Overview

Agent 4 transforms verified workflows and test cases into a real, executable Playwright/TypeScript test suite. It enforces Page Object Model architecture, splits tests by pyramid layer (UI vs API), applies pre-emptive patterns from the knowledge store, and registers shared page dependencies for cross-feature impact tracking.

> **Golden Rule:** Generated code must be **readable by a human QA engineer**, not just executable by Playwright. Clean POM, descriptive method names, traceability comments — this is production automation code, not a throwaway script.

---

## 🛠️ Architectural Requirements

### 1. Page Object Model (POM) — Mandatory

Every page = one class, extending `BasePage`:

```typescript
// pages/{page-name}.page.ts
import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { sel, REGISTER_SELECTORS } from '../utils/selectors';

export class RegisterPage extends BasePage {
  get path(): string { return '/register'; }

  // ─── Locators (from centralized selectors) ─────────────
  get companyNameInput(): Locator {
    return this.page.locator(sel(REGISTER_SELECTORS.companyName));
  }

  // ─── Actions ────────────────────────────────────────────
  async fillCompanyName(name: string): Promise<void> {
    await this.companyNameInput.fill(name);
  }

  // ─── Assertions ─────────────────────────────────────────
  async assertRegistrationSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/register\/result/);
    await expect(this.page.locator('.result')).toBeVisible();
    await expect(this.page.locator('.result')).not.toBeEmpty();
  }
}
```

**POM Rules:**
- All locators come from `utils/selectors.ts` via `sel()`. NEVER hardcode inline.
- Action methods: `fill*()`, `click*()`, `select*()`, `navigate*()`.
- Assertion methods: `assert*()` — always dual-factor (URL + DOM).
- No business logic in page objects — only interaction + observation.

### 2. Centralized Selectors — Enhanced with Fallback Tiers

`utils/selectors.ts`'s `SelectorEntry` type has a real `fallbacks` field (not just a comment) — populate it from Agent 3's `verify.json` `locatorCandidates` whenever more than one tier was verified for an element:

```typescript
export const REGISTER_SELECTORS = {
  companyName: {
    selector: '#CompanyName',              // primary — from verify.json's recommendedSelector
    description: 'Company name input',
    fallbacks: [
      { tier: 'T5', selector: "input[name='CompanyName']" },
    ],
  },
} as const;
```

This is what Loop B (Stage 7) patches mechanically on a `FLAKY_LOCATOR` heal: it appends a new candidate to `fallbacks` first, and only promotes it to be the primary `selector` after the semantic-verification gate passes — never edit `fallbacks` by hand as a comment, it must stay structured data both stages can read and write.

### 3. Layer Split — UI vs API Specs

| Layer | Directory | Technology | When to Use |
|-------|-----------|------------|-------------|
| **UI** | `tests/e2e/{feature}/` | Playwright browser | TC tagged `Layer: UI` — tests rendering, navigation, form interaction |
| **API** | `tests/api/{feature}/` | Playwright `APIRequestContext` | TC tagged `Layer: API` — tests business logic, data validation, response shape |

**API Spec Template:**

```typescript
// tests/api/{feature}/{feature}-api.spec.ts
import { test, expect } from '@playwright/test';
import { ENV } from '../../../utils/env';

/**
 * Traceability: TC-008 (REQ-41, REQ-44, REQ-45) — Duplicate email rejection
 * Layer: API
 */
test.describe('{Feature} API Validation @api @regression', () => {
  test('TC-008: Duplicate email returns validation error — REQ-41', async ({ request }) => {
    const response = await request.post(`${ENV.BASE_URL}/register`, {
      form: { Email: 'existing@test.com', /* ... */ }
    });
    expect(response.status()).toBe(200); // NopCommerce returns 200 with error body
    const body = await response.text();
    expect(body).toContain('already in use');
  });
});
```

### 4. API Contract / Schema Validation

API-layer specs validate response **shape** in addition to values:

```typescript
// Validate response structure, not just values
const data = await response.json();
expect(data).toHaveProperty('success');
expect(data).toHaveProperty('message');
expect(typeof data.success).toBe('boolean');
```

### 5. Session / State Handling

- **Login reuse**: Use Playwright `storageState` from `tests/.auth/customer.json` and `tests/.auth/admin.json`.
- **Never re-login per test** — wasteful and flaky.
- **Explicit setup/teardown**: Call Agent 0's cleanup hooks in `afterAll()`:

```typescript
test.afterAll(async () => {
  // Agent 0 cleanup: remove tagged test data
  // Only if environment is write-safe
});
```

### 5a. Timeout Budget for Multi-Context Tests

**Incident (2026-08-18):** Tests combining a multi-step registration flow with a SECOND (or third) `browser.newContext()` for admin/login verification consistently exceeded the suite's default `timeout` in headed mode against a live site — Playwright force-closed the nested context mid-action, producing a misleading `"Target page, context or browser has been closed"` error that looks like browser instability rather than the real cause (not enough time budgeted).

Whenever generated spec code opens an additional `browser.newContext()` beyond the primary `page` fixture (e.g. a `withAdminPage()`-style helper, or a post-action re-login check), add an explicit `test.setTimeout()` as the first line of that test, sized as:

```
primary flow duration  +  (per extra context × [navigation + storageState load + assertions])
```

As a starting point against a live site in headed mode: budget ~15-20s for the primary flow per step, plus ~20-25s per extra context. Round up — a test finishing early costs nothing; a test timing out mid-assertion produces a confusing error that hides the real one. Never rely on the suite-wide default `timeout` to cover this — it's sized for the common single-context case.

### 6. Dynamic Waits — No Fixed Sleeps

| Pattern | Implementation |
|---------|---------------|
| Page navigation | `await page.waitForURL('/expected-path')` |
| AJAX completion | `await waitForAjaxComplete(page)` |
| Element appearance | `await expect(locator).toBeVisible({ timeout: 10000 })` |
| Element disappearance | `await expect(locator).toBeHidden({ timeout: 10000 })` |
| Network idle | `await page.waitForLoadState('networkidle')` |
| Text content | `await expect(locator).toHaveText('expected', { timeout: 10000 })` |

**BANNED:** `await page.waitForTimeout(N)` — NEVER use fixed sleeps in generated specs.

### 7. Data-Driven Design

External test data from Agent 0, not hardcoded:

```typescript
import testData from '../../fixtures/test-data/json/{feature}.json';

test.describe('{Feature} — Data-Driven Scenarios', () => {
  for (const scenario of testData.scenarios) {
    test(`TC-${scenario.id}: ${scenario.title}`, async ({ page }) => {
      // Use scenario.input, scenario.expectedResult
    });
  }
});
```

### 8. Validation Layer Separation

Separate assertion helpers from action helpers so tests read as **steps + checks**:

```typescript
// In spec file — clean step-check-step-check pattern:
await registerPage.fillStep1(testData.step1);
await registerPage.assertStep1Complete();     // Check
await registerPage.clickNext();               // Step
await registerPage.fillStep2(testData.step2);
await registerPage.assertStep2Complete();     // Check
```

### 9. Traceability Comment Header

Every generated spec file starts with:

```typescript
/**
 * ═══════════════════════════════════════════════════════════════
 * Feature: {Feature Name}
 * Story: {Story slug}
 * Traceability:
 *   TC-001 → REQ-01, REQ-02 (Happy Path Registration)
 *   TC-002 → REQ-06 (Business Type Dropdown Selection)
 *   TC-008 → REQ-41, REQ-44, REQ-45 (Duplicate Email Rejection)
 *
 * Generated by: Agent 4 — Automation Codegen
 * Generated at: {iso-timestamp}
 * Source: workflows/{feature}.journey.json
 * Verified: workflows/{feature}.verify.json
 * ═══════════════════════════════════════════════════════════════
 */
```

### 10. Pre-Emptive Pattern Injection

Before generating code, load `memory/healed-patterns.json`:

- Query for `TRUSTED` patterns matching the current page/component.
- If a trusted pattern exists (e.g., Select2 handling) → use it from day one.
- Log which patterns were injected in the traceability header.

### 11. Shared-Page Dependency Registration

After creating or modifying a page object, update `memory/page-dependency-index.md`:

```markdown
## Page Dependency Index

| Page Object | Features Using It | Last Modified |
|-------------|-------------------|---------------|
| `register.page.ts` | b2b-registration | 2026-08-14 |
| `checkout.page.ts` | wholesale-checkout | 2026-08-14 |
| `wishlist.page.ts` | wishlist-management | 2026-08-14 |
| `home.page.ts` | b2b-registration, wishlist-management | 2026-08-14 |
| `login.page.ts` | b2b-registration, wishlist-management, wholesale-checkout | 2026-08-14 |
```

### 12. Cross-Browser / Viewport Config

Playwright projects in `playwright.config.ts`:

| Project | Browser | Viewport | Runs For |
|---------|---------|----------|----------|
| `storefront-chromium` | Desktop Chrome | 1280×720 | All P0/P1/P2 tests |
| `storefront-firefox` | Desktop Firefox | 1280×720 | P0 tests only (nightly) |
| `storefront-mobile` | iPhone 14 | 390×844 | P0 tests only (nightly) |
| `admin-chromium` | Desktop Chrome | 1280×720 | Admin-specific tests |

---

## 📄 Output Files
- `pages/{page}.page.ts` (Page Object classes)
- `utils/selectors.ts` (Centralized selectors — updated/appended)
- `tests/e2e/{feature}/{feature}.spec.ts` (UI-layer Playwright specs)
- `tests/api/{feature}/{feature}-api.spec.ts` (API-layer specs)
- `memory/page-dependency-index.md` (Shared page registration — updated)

## ✅ Gate Condition
- All TCs from Agent 2 have corresponding spec implementations.
- POM pattern enforced — no inline selectors in specs.
- Traceability headers link every spec to TC IDs.
- Pre-emptive patterns from `healed-patterns.json` applied.
- Page dependency index updated.
- TypeScript compiles without errors (`npx tsc --noEmit`).

## ❌ Blocked Conditions
- Agent 3 (Live Explorer) has not verified selectors → MUST NOT generate code with unverified selectors.
- `healed-patterns.json` inaccessible → Generate without patterns (log warning).
