---
name: 09-learning-prevention
description: Process test execution outcomes (passes & failures) into validated reusable knowledge patterns (Loop C).
---

# Stage 9 — Learning & Prevention Skill (Loop C)

## Overview
Stage 9 acts as the continuous intelligence engine (Loop C). It ingests both **Pass** and **Fail** outcomes from Stage 7 execution, processes them through a **Pattern Knowledge Lifecycle**, and updates `memory/healed-patterns.json`. Trusted patterns are then injected as pre-emptive guidance into future Stage 2 (Design), Stage 4 (DOM Feasibility), and Stage 5 (Codegen) runs.

---

## 🔄 Both Pass & Fail Learning Ingestion

1. **Pass Outcomes**:
   - Extracts stable selectors, effective waiting strategies, successful form fill sequences, and DOM interaction patterns.
   - Increments `successCount` for existing candidate patterns.
2. **Fail Outcomes**:
   - Ingests failure classifications, fragile selectors, and anti-patterns.
   - Increments `failureCount` and updates failure root-cause indicators.

---

## 📈 Pattern Knowledge Lifecycle

```text
Raw Execution Event ➔ Candidate Pattern ➔ Lifecycle Validation ➔ Trusted Pattern ➔ Knowledge Base
```

### Pattern State Definitions:
- **RAW**: Newly observed event from a single execution run.
- **CANDIDATE**: Repeatedly observed pattern ($\ge 2$ occurrences).
- **TRUSTED**: Pattern validated across multiple runs ($\text{successCount} \ge 3 \land \text{failureCount} = 0 \land \text{confidence} \ge 0.95$).

---

## 📄 Knowledge Base Output Format (`memory/healed-patterns.json`)

```json
{
  "patterns": [
    {
      "patternId": "PAT-001",
      "component": "Select2 Custom Dropdown",
      "interactionStrategy": "click container -> fill search input -> await options -> click active option",
      "selectorPattern": "span.select2-container",
      "successCount": 7,
      "failureCount": 0,
      "confidence": 0.99,
      "status": "TRUSTED",
      "lastValidated": "2026-08-11T12:30:00Z"
    }
  ]
}
```

---

## 🛑 Pre-emptive Feedback Injection Points

- **Stage 2 (Design)**: Injects known UI interaction complexities into step design.
- **Stage 4 (Feasibility Bridge)**: Matches DOM selectors against `TRUSTED` patterns.
- **Stage 5 (Codegen)**: Pre-emptively generates robust Page Object methods using `TRUSTED` interaction strategies from day one, preventing repeated self-healing cycles.
