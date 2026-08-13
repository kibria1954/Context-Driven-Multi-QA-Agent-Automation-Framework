# Test Cases — `b2b-registration`

> **Loop A Convergence Gate Status**: `PASS` (Req Coverage: 100%, Risk: 100%, Traceability: 100%, BVA: 100%)

---

## 🟢 POSITIVE SCENARIOS

### TC-REG-001 — Positive: Successful B2B Registration Form Submission & Entity Creation — REQ-01
- **Requirement**: REQ-01
- **Type**: positive
- **Layer**: functional
- **Priority**: critical
- **Tags**: `@smoke`, `@regression`, `@REQ-01`
- **Steps**:
  1. Fill multi-step B2B registration form with dynamic faker data.
  2. Select preferred contact media channel (WhatsApp) and complete fields.
  3. Submit registration form.
- **Expected Result**: Form submits successfully and confirmation message is displayed.

---

### TC-REG-002 — Positive: Admin Reviews Wholesale Application Details — REQ-03
- **Requirement**: REQ-03
- **Type**: positive
- **Layer**: functional
- **Priority**: critical
- **Tags**: `@admin`, `@regression`, `@REQ-03`
- **Steps**:
  1. Admin logs into admin panel.
  2. Search for registered wholesale customer.
  3. Verify KD Registration Details section contains submitted business details.
- **Expected Result**: Admin views complete wholesale application data accurately.

---

### TC-REG-003 — Positive: Admin Approves and Activates B2B Account — REQ-04
- **Requirement**: REQ-04
- **Type**: positive
- **Layer**: functional
- **Priority**: critical
- **Tags**: `@admin`, `@regression`, `@REQ-04`
- **Steps**:
  1. Open wholesale customer profile in admin panel.
  2. Toggle Active switch to true and save.
- **Expected Result**: Account status updates to Active and save notification appears.

---

### TC-REG-004 — Positive/UI: Dynamic Contact Channel Toggle & Field Clear — REQ-06
- **Requirement**: REQ-06
- **Type**: positive
- **Layer**: ui
- **Priority**: medium
- **Tags**: `@ui`, `@regression`, `@REQ-06`
- **Steps**:
  1. Select `WhatsApp` channel and enter WhatsApp number.
  2. Switch channel selection to `Messenger`.
  3. Switch back to `WhatsApp`.
- **Expected Result**: Input fields toggle visible/hidden dynamically and clear stale values.

---

## 🔴 NEGATIVE & BOUNDARY SCENARIOS

### TC-REG-005 — Negative: Uniqueness Validation for Duplicate Email/Username — REQ-02
- **Requirement**: REQ-02
- **Type**: negative
- **Layer**: functional
- **Priority**: critical
- **Tags**: `@regression`, `@REQ-02`
- **Steps**:
  1. Attempt registration using existing customer email.
- **Expected Result**: System blocks submission and displays duplicate email warning message.

---

### TC-REG-006 — Negative: Password Mismatch Validation — REQ-05
- **Requirement**: REQ-05
- **Type**: negative
- **Layer**: validation
- **Priority**: high
- **Tags**: `@regression`, `@REQ-05`
- **Steps**:
  1. Enter password `Secret123!` and confirm password `Mismatch999!`.
- **Expected Result**: Validation error indicates passwords do not match.

---

### TC-REG-007 — Boundary: Invalid BD Mobile Format — REQ-05
- **Requirement**: REQ-05
- **Type**: negative
- **Layer**: boundary
- **Priority**: high
- **Tags**: `@boundary`, `@regression`, `@REQ-05`
- **Steps**:
  1. Enter 10-digit mobile number `0171122334`.
- **Expected Result**: Validation error prompts for valid 11-digit BD mobile number starting with 01.

---

### TC-REG-008 — Negative: Missing Required Agreement Checkboxes Validation — REQ-01
- **Requirement**: REQ-01
- **Type**: negative
- **Layer**: validation
- **Priority**: high
- **Tags**: `@validation`, `@regression`, `@REQ-01`
- **Steps**:
  1. Leave Terms of Service checkbox unchecked and submit form.
- **Expected Result**: Submission blocked with terms agreement warning.

---

### TC-REG-009 — Negative: Invalid Email Format Validation — REQ-02
- **Requirement**: REQ-02
- **Type**: negative
- **Layer**: validation
- **Priority**: high
- **Tags**: `@validation`, `@regression`, `@REQ-02`
- **Steps**:
  1. Enter email `invalid.email.without.at.com`.
- **Expected Result**: Form displays invalid email format error.

---

## 🟣 EDGE SCENARIOS

### TC-REG-010 — Edge: Special Characters in Company Name & Dynamic Sanitization — REQ-01
- **Requirement**: REQ-01
- **Type**: edge
- **Layer**: edge
- **Priority**: medium
- **Tags**: `@edge`, `@regression`, `@REQ-01`
- **Steps**:
  1. Enter company name with special symbols `Apex & Co. <Beauty> 'Ltd'`.
- **Expected Result**: Company name is processed safely without XSS or rendering failures.
