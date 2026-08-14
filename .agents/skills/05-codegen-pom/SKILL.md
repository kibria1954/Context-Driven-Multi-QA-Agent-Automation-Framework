---
name: 05-codegen-pom
description: Generate Playwright TypeScript test specs and Page Objects adhering to POM design pattern and centralized selectors.
---

# Stage 5 — POM & Code Generation Skill

## Overview
Stage 5 translates verified user journeys into clean, maintainable Playwright TypeScript test specs and Page Object Model (POM) classes adhering strictly to centralized selector management in `utils/selectors.ts`.

---

## 🛠️ Architectural Guidelines

### 1. Page Object Model (POM) Rules
- Every page class must inherit from `BasePage` (`pages/base.page.ts`).
- **Centralized Selectors**: All element locators MUST reside in `utils/selectors.ts`. Never hardcode inline CSS/XPath selectors in spec files.
- **Pre-Emptive Pattern Injection**: Query `memory/healed-patterns.json` (Stage 9) for `TRUSTED` interaction patterns (e.g. Select2 dropdowns, dynamic popups) before generating code to prevent repeat failures.
- Include step actions and explicit assertion methods on page object classes (e.g. `assertActionSuccess()`, `assertEntityStatus()`).

### 2. Spec File Standards
- Spec files reside in `tests/e2e/<feature>/<story>.spec.ts`.
- Use custom fixtures (`import { test, expect } from '../../fixtures/custom-fixtures'`).
- Generate dynamic test data using faker utilities (`generateDynamicTestData()`).
- Tag tests with requirement IDs and execution categories (`@smoke`, `@regression`, `@REQ-01`).

---

## 📄 Output Files
- `pages/*.page.ts` (Page Objects)
- `utils/selectors.ts` (Centralized Selectors)
- `tests/e2e/<feature>/<story>.spec.ts` (Playwright Spec File)
