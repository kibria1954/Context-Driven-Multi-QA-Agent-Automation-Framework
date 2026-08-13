---
name: 08-report-generation
description: Generate interactive custom HTML executive dashboard and summary report.
---

# Stage 8 — Custom Report Generation Skill

## Overview
Stage 8 aggregates execution data, traceability matrices, and self-heal audit logs to generate an executive-ready, interactive dark-mode glassmorphic HTML dashboard (`reports/generated/<story>-report.html`).

---

## 🛠️ Executive Dashboard Features

### 1. Executive Summary Grid
- **Pass Rate Badge**: Color-coded (≥90% Green `#10b981`, 70-89% Yellow `#f59e0b`, <70% Red `#ef4444`).
- **Metric Cards**: Total Tests, Passed, Failed, Skipped, Quarantined.
- **Pass Rate Progress Bar**: Gradient animated bar visualization.

### 2. Test Execution Breakdown
- Table detailing `TC-ID`, `Test Name`, `Scenario Type` (Positive, Negative, Edge), `Status`, `Duration`, and `REQ-ID`.

### 3. Scenario Type Breakdown
- Grid breakdown displaying counts for Positive, Negative, and Edge/Security scenarios.

### 4. Self-Heal Audit Log Section
- Displays real-time self-healing records (Timestamp, Test Title, Failure Class, Action Taken).

---

## 📄 Output Files
- `reports/generated/<story>-report.html` (Interactive Custom Dashboard)
- `reports/generated/<story>-report.md` (Markdown Summary Report)
