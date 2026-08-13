# 📜 QA AI Agent — Central Command Registry (`COMMANDS.md`)

This file is the **Single Source of Truth** for running, debugging, and generating reports for all automated Playwright test suites in this project. All commands are pre-configured to launch visually in a **Single Browser Window** (`--headed --workers=1`) so you can watch clean sequential execution.

---

## 🌐 1. Single Browser Headed Commands (Sequential Live Watch)

### 👥 B2B Registration Suite (10 Test Scenarios)
- **NPM Shortcut**:
  ```bash
  npm run test:b2b
  ```
- **Direct Playwright Command**:
  ```bash
  npx playwright test tests/e2e/registration/b2b-registration.spec.ts --headed --workers=1 --project=storefront-guest
  ```

### 💖 Wishlist Management Suite (9 Test Scenarios)
- **NPM Shortcut**:
  ```bash
  npm run test:wishlist
  ```
- **Direct Playwright Command**:
  ```bash
  npx playwright test tests/e2e/catalog/wishlist-management.spec.ts --headed --workers=1
  ```

### 🛒 Wholesale Direct Checkout Suite (10 Test Scenarios)
- **NPM Shortcut**:
  ```bash
  npm run test:checkout
  ```
- **Direct Playwright Command**:
  ```bash
  npx playwright test tests/e2e/checkout/wholesale-checkout.spec.ts --headed --workers=1
  ```

### 🚀 All Test Suites Together (Single Browser Sequential Run)
- **NPM Shortcut**:
  ```bash
  npm run test:all:headed
  ```
- **Direct Playwright Command**:
  ```bash
  npx playwright test tests/e2e/registration/b2b-registration.spec.ts tests/e2e/catalog/wishlist-management.spec.ts tests/e2e/checkout/wholesale-checkout.spec.ts --headed --workers=1
  ```

---

## 🎛️ 2. Interactive UI & Debugging Modes

### 📊 Playwright Interactive UI Dashboard (Step-by-Step Visual Debug)
- **NPM Shortcut**:
  ```bash
  npm run test:ui
  ```

### 🐞 Step-by-Step Inspector Debugger Mode
- **NPM Shortcut**:
  ```bash
  npm run test:debug
  ```

---

## 📊 3. Executive HTML & Markdown Report Generation

- **Generate B2B Registration Custom Report**:
  ```bash
  npm run report:b2b
  ```
- **Generate Wishlist Management Custom Report**:
  ```bash
  npm run report:wishlist
  ```
- **Generate Wholesale Direct Checkout Custom Report**:
  ```bash
  npm run report:checkout
  ```
- **View Built-in Playwright Report**:
  ```bash
  npm run report:playwright
  ```

---

## 🏷️ 4. Tag-Based Test Filtering (Single Browser)

- **Run Only `@smoke` Tests (Single Browser)**:
  ```bash
  npx playwright test --grep @smoke --headed --workers=1
  ```
- **Run Only `@regression` Tests (Single Browser)**:
  ```bash
  npx playwright test --grep @regression --headed --workers=1
  ```
- **Run Only `@security` / `@boundary` Tests (Single Browser)**:
  ```bash
  npx playwright test --grep "@security|@boundary" --headed --workers=1
  ```
