---
name: 04-live-explorer
description: Explore live application DOM to verify interactive selectors, inputs, buttons, and state transitions.
---

# Stage 4 — Live Explorer Skill

## Overview
Stage 4 inspects the target live application DOM using browser subagent tools to verify element IDs, form control types, dynamic dropdown behaviors (e.g. Select2, custom components), and popup overlay modals before generating automated test code.

---

## 🛠️ Live Site Verification Checklist

### 1. Element & Selector Audit
- Verify input element attributes (`id`, `name`, `type`, `class`).
- Inspect dynamic custom dropdowns (e.g. custom role filters, tags, select options).
- Identify submit and action buttons (`button[type="submit"]`, `button[name="save"]`, etc.).

### 2. Modal & Overlay Handling
- Check for global popups and modal overlays.
- Document dismissal rules (`.modal .close`, backdrop clicks, escape key).

### 3. Verification Log Output (`.verify.json`)
Record verified DOM properties:
```json
{
  "page": "<Page Name>",
  "urlPattern": "/<path-pattern>/*",
  "selectors": {
    "targetField": "input#field-id",
    "submitBtn": "button[name=\"submit\"]"
  },
  "verified": true
}
```

---

## 📄 Output Files
- `context/verification-logs/<story>.verify.md`
- `context/verification-logs/<story>.verify.json`
