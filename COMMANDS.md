# 📜 QA AI Agent v2 — Central Command Registry (`COMMANDS.md`)

This file is the **Single Source of Truth** for running, debugging, and generating reports for all automated Playwright test suites in this project. All commands are pre-configured to launch visually in a **Single Browser Window** (`--headed --workers=1`) so you can watch clean sequential execution.

---

## 🌐 1. Single Browser Headed Commands (Sequential Live Watch)

### 👥 B2B Registration Suite
- **NPM Shortcut**:
  ```bash
  npm run test:b2b
  ```
- **Direct Playwright Command**:
  ```bash
  npx playwright test tests/e2e/registration/b2b-registration.spec.ts --headed --workers=1 --project=storefront-guest
  ```

### 💖 Wishlist Management Suite
- **NPM Shortcut**:
  ```bash
  npm run test:wishlist
  ```
- **Direct Playwright Command**:
  ```bash
  npx playwright test tests/e2e/catalog/wishlist-management.spec.ts --headed --workers=1
  ```

### 🛒 Wholesale Direct Checkout Suite
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
  npx playwright test tests/e2e/ --headed --workers=1
  ```

---

## 🧪 2. API-Layer Tests (No Browser)

### Run All API Tests
```bash
npm run test:api
```

### Direct Playwright Command
```bash
npx playwright test tests/api/ --workers=4
```

---

## 🎯 3. Priority-Based Execution

### P0 Only (Critical Smoke)
```bash
npm run test:p0
```

### P1 + P0 (Regression)
```bash
npx playwright test --grep "@P0|@P1" --headed --workers=1
```

---

## 🎛️ 4. Interactive UI & Debugging Modes

### 📊 Playwright Interactive UI Dashboard
```bash
npm run test:ui
```

### 🐞 Step-by-Step Inspector Debugger
```bash
npm run test:debug
```

---

## 📊 5. Executive HTML & Markdown Report Generation

- **Generate B2B Registration Report**:
  ```bash
  npm run report:b2b
  ```
- **Generate Wishlist Management Report**:
  ```bash
  npm run report:wishlist
  ```
- **Generate Wholesale Checkout Report**:
  ```bash
  npm run report:checkout
  ```
- **View Built-in Playwright Report**:
  ```bash
  npm run report:playwright
  ```

---

## 📏 6. Coverage & Traceability Validation

### Validate Requirements Coverage
```bash
npm run qa:coverage
```

---

## 🏷️ 7. Tag-Based Test Filtering (Single Browser)

- **Run Only `@smoke` Tests**:
  ```bash
  npx playwright test --grep @smoke --headed --workers=1
  ```
- **Run Only `@regression` Tests**:
  ```bash
  npx playwright test --grep @regression --headed --workers=1
  ```
- **Run Only `@security` / `@boundary` Tests**:
  ```bash
  npx playwright test --grep "@security|@boundary" --headed --workers=1
  ```

---

## 🔧 8. Development & Quality

### TypeScript Compilation Check
```bash
npm run typecheck
```

### Lint & Format
```bash
npm run lint
npm run format
```

---

## 🏗️ 9. Pipeline Agent Reference

| Agent | Description | Key Command |
|-------|-------------|-------------|
| Agent 0 | Test Data & Environment | `npm run typecheck` (validates env.ts) |
| Agent 1 | Requirement Ingestion | Manual (paste requirement, run pipeline) |
| Agent 2 | Test Case Design (Loop A) | Manual (generates testcases/*.tc.md) |
| Agent 3 | Live Exploration | Manual (browser subagent + verify.json) |
| Agent 4 | Automation Codegen | Manual (generates pages/*.ts + tests/**/*.spec.ts) |
| Agent 5 | Execution & Self-Heal | `npm run test:b2b` / `npm run test:wishlist` / etc. |
| Agent 6 | Coverage Validation | `npm run qa:coverage` |
| Agent 7 | Report Generation | `npm run report:b2b` / `npm run report:wishlist` / etc. |
| Loop ∞ | Learning & Prevention | Automatic (after Agent 7 completes) |
