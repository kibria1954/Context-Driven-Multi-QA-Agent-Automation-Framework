---
name: 04-live-explorer
description: Explore live application DOM to verify interactive selectors, inputs, buttons, and state transitions.
---

# Stage 4 — Live Explorer Skill

## Overview
Stage 4 inspects the live application (`https://kbd.nop-station.site`) using browser subagent tools to verify DOM element IDs, form control types, Select2 dropdown behaviors, and popup overlay modals before generating automated code.

---

## 🛠️ Live Site Verification Checklist

### 1. Element & Selector Audit
- Verify input element attributes (`id`, `name`, `type`, `class`).
- Inspect Select2 custom dropdowns (e.g. customer role filter tags, business type options).
- Identify submit buttons (`button[name="save"]`, `button[name="save-continue"]`).

### 2. Modal & Overlay Handling
- Check for global popups (e.g. `Ready to grow your K-Beauty business?` modal).
- Document dismissal rules (`#kd-modal .close`, backdrop clicks).

### 3. Verification Log Output (`.verify.json`)
Record verified DOM properties:
```json
{
  "page": "Admin Customer Edit",
  "urlPattern": "/Admin/Customer/Edit/*",
  "selectors": {
    "activeCheckbox": "input#Active",
    "saveContinueBtn": "button[name=\"save-continue\"]"
  },
  "verified": true
}
```

---

## 📄 Output Files
- `context/verification-logs/<story>.verify.md`
- `context/verification-logs/<story>.verify.json`
