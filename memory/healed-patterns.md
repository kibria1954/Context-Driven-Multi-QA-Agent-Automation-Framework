# 🧠 Healed Knowledge Patterns & Memory Registry (`healed-patterns.md`)

This file is auto-synchronized with `memory/healed-patterns.json` (Loop C Learning & Prevention Protocol). All trusted design & locator patterns recorded here are automatically queried by Stage 5 POM Code Generation to prevent recurring failures.

---

## 📋 Active Trusted Patterns (`TRUSTED`)

### 1. `PAT-SEL2-001` — Select2 Custom Dropdown Widget
- **Status**: `TRUSTED` (Confidence: 99%)
- **Applicable Pages**: `/register`, `/Admin/Customer/*`
- **Interaction Strategy**:
  ```typescript
  await page.locator('span.select2-container').click();
  await page.locator('input.select2-search__field').fill(optionText);
  await page.locator('li.select2-results__option--highlighted').click();
  ```

---

### 2. `PAT-MODAL-002` — KDN Welcome Overlay Modal
- **Status**: `TRUSTED` (Confidence: 100%)
- **Applicable Pages**: `/*`
- **Interaction Strategy**:
  ```typescript
  await page.evaluate(() => {
    document.getElementById('kdn-welcome-modal')?.remove();
    document.querySelectorAll('.kdn-welcome-modal-overlay, .modal-backdrop').forEach(el => el.remove());
    document.body.style.overflow = '';
  });
  ```

---

### 3. `PAT-POPUP-003` — Async Multi-Popup Overlay & Don't Show Again Checkbox
- **Status**: `TRUSTED` (Confidence: 99%)
- **Applicable Pages**: `/*`
- **Interaction Strategy**:
  ```typescript
  // 1. Check Don't Show Again checkbox if present
  const dontShow = page.locator('input[type="checkbox"][name*="dont-show"]').first();
  if (await dontShow.isVisible({ timeout: 400 }).catch(() => false)) {
    await dontShow.check({ force: true }).catch(() => {});
  }
  // 2. Count and click close buttons, then strip #multi-popup-overlay
  await page.evaluate(() => {
    document.querySelectorAll('#multi-popup-overlay, .multi-popup-overlay').forEach(el => el.remove());
    document.body.style.overflow = '';
  });
  ```

---

### 4. `PAT-STRICT-004` — Header & Footer Navigation Strict Mode Disambiguation
- **Status**: `TRUSTED` (Confidence: 100%)
- **Applicable Pages**: `/*`
- **Interaction Strategy**:
  ```typescript
  // Append .first() to locator getters in POM classes to prevent Playwright strict mode collisions
  get headerWishlistLink() {
    return this.page.locator(sel(WISHLIST_SELECTORS.wishlistHeaderLink)).first();
  }
  ```
