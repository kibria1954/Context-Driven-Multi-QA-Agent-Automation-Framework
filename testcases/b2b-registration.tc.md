# Test Cases — B2B Registration

**Feature:** `b2b-registration` | **Generated:** 2026-08-15 | **Loop A Iterations:** 1 | **Total TCs:** 30

> **Stage 4 correction, applies to all Step-1-field negative/boundary TCs (TC-003, TC-006, TC-007, TC-008, TC-009, TC-010, TC-023, TC-024, TC-025):** live verification found that Step 1 field validation — including the email/username uniqueness check — fires when clicking **"Next" (Step 1 → Step 2)**, not at the final "Submit Application" button. Where a TC below says "submit" for a Step-1-only field, the actual blocking action is clicking Next after Step 1, not filling the whole form. See `workflows/b2b-registration.verify.json` for the exact captured behavior.



---

## TC-001 — Positive: Successful B2B Registration Form Submission & Entity Creation — REQ-01

- **Requirement:** REQ-01
- **Acceptance Criteria:** AC-01
- **Type:** positive
- **Layer:** UI
- **Priority:** P0
- **Tags:** smoke, regression, req-01
- **Status:** draft

**Preconditions:**
- User is on `/register`, not logged in.
- Fresh synthetic customer data from Agent 0 (`testdata/b2b-registration/seed.json`) — unique email, 11-digit BD phone, unique company name.

**Steps:**
1. Navigate to `/register`.
2. Fill all Company Info fields with valid synthetic data.
3. Fill Contact Details (WhatsApp selected, WhatsApp Number filled).
4. Fill Account Setup fields (matching Username/Password/Confirm Password).
5. Check all 4 agreement checkboxes.
6. Click "Create Account".

**Expected Result:**
- **URL State:** Redirected to the registration result/success page.
- **DOM State:** Success message visible, notifying the user the application is under review.
- **Data State:** A new ERP Account exists using the Company Name; a Ship-To Address (Branch) exists using the submitted physical address; a new B2B customer account exists in "inactive" state, mapped to the new ERP account (verified via admin panel — see TC-026).

---

## TC-002 — Positive: Valid Submission With Alternate Type of Business / Contact Media — REQ-01

- **Requirement:** REQ-01 | **AC:** AC-01 | **Type:** positive | **Layer:** UI | **Priority:** P1
- **Tags:** regression, req-01 | **Status:** draft

**Preconditions:** Same as TC-001, but select a different `Type of Business` option (e.g. "Wholesaler (Physical shop)") and `Contact Media = Messenger`.

**Steps:** Same flow as TC-001 with the alternate dropdown/contact-media selections.

**Expected Result:** Same successful entity-creation outcome as TC-001, confirming the flow works across valid input variants, not just one hardcoded combination.

---

## TC-003 — Negative: Missing Required Field Blocks Submission, No Entities Created — REQ-01

- **Requirement:** REQ-01 | **AC:** AC-01 | **Type:** negative | **Layer:** UI | **Priority:** P0
- **Tags:** regression, validation, req-01 | **Status:** draft

**Preconditions:** Same as TC-001, but leave Company Name blank.

**Steps:** Fill all other fields validly, leave Company Name empty, click "Create Account".

**Expected Result:**
- **URL State:** Remains on `/register`.
- **DOM State:** Field-level validation error visible on Company Name.
- **Data State:** No ERP account, Ship-To address, or customer entity created (submission never reached the backend).

**Negative Specifics:**
- **Missing Element:** Success/redirect page is NOT shown.
- **Error Message:** Exact validation text observed live during Stage 4 (not guessed).

---

## TC-004 — Edge: Rapid Double-Click on Create Account — No Duplicate Entities — REQ-01

- **Requirement:** REQ-01 | **AC:** AC-01 | **Type:** edge | **Layer:** UI | **Priority:** P1
- **Tags:** edge, regression, req-01 | **Status:** draft

**Preconditions:** Same as TC-001, valid complete form.

**Steps:** Fill the form validly, then double-click "Create Account" rapidly (simulated via two fast `click()` calls or `Promise.all`).

**Expected Result:** Exactly one ERP account, one Ship-To address, and one inactive customer are created — not two. The button should disable itself (or requests should dedupe) on first click.

---

## TC-005 — Positive: All Company Info Fields Accepted (Multiple Business Types) — REQ-02

- **Requirement:** REQ-02 | **AC:** AC-01 | **Type:** positive | **Layer:** UI | **Priority:** P0
- **Tags:** regression, req-02 | **Status:** draft

**Preconditions:** User on `/register`, valid synthetic data for every Company Info field.

**Steps:** Fill Company Name, Type of Business, Email, Phone Number (BD 11-digit), Website URL, Address Line 1 & 2, City, State, Zip Code. Complete the rest of the form validly and submit.

**Expected Result:** Form accepts all fields; no field-level validation errors on Company Info section.

---

## TC-006 — Negative: Empty Company Name Blocks Submission — REQ-02

- **Requirement:** REQ-02 | **AC:** AC-01 | **Type:** negative | **Layer:** UI | **Priority:** P0
- **Tags:** regression, validation, req-02 | **Status:** draft

**Steps:** Leave Company Name blank, fill rest of Step 1 validly, click "Next".

**Expected Result:** Blocked at Step 1. Exact captured text: **"Company name is required."** (verbatim, from `workflows/b2b-registration.verify.json`).

---

## TC-007 — Negative: Invalid Email Format Blocks Submission — REQ-02

- **Requirement:** REQ-02 | **AC:** AC-01 | **Type:** negative | **Layer:** UI | **Priority:** P0
- **Tags:** regression, validation, req-02 | **Status:** draft

**Steps:** Enter an invalid email (e.g. `not-an-email`), fill rest validly, submit.

**Expected Result:** Field-level validation error on Email; submission blocked.

---

## TC-008 — Boundary: BD Phone Number Length (11-digit valid, 10/12-digit rejected) — REQ-02

- **Requirement:** REQ-02 | **AC:** AC-01 | **Type:** boundary | **Layer:** UI | **Priority:** P1
- **Tags:** boundary, regression, req-02 | **Status:** draft

**Steps:**
1. Submit with a valid 11-digit BD number (e.g. `01709439332`) → expect acceptance.
2. Submit with a 10-digit number → expect rejection.
3. Submit with a 12-digit number → expect rejection.

**Expected Result:** Only the 11-digit, valid-prefix BD number passes phone validation; both boundary-breach lengths are rejected with a validation error.

---

## TC-009 — Edge: Special Characters / Unicode in Company Name — REQ-02

- **Requirement:** REQ-02 | **AC:** AC-01 | **Type:** edge | **Layer:** UI | **Priority:** P2
- **Tags:** edge, security, req-02 | **Status:** draft

**Steps:** Enter a Company Name containing punctuation and non-Latin characters (e.g. `O'Brien & Co. Ltd. — 한국무역`), submit.

**Expected Result:** Value is accepted, correctly rendered/stored, and does not break form rendering, DB storage, or trigger a script-injection side effect (basic XSS-adjacent sanity check, appropriate here since this is a public, unauthenticated form).

---

## TC-010 — Boundary: Zip Code Empty vs Whitespace-Only — REQ-02

- **Requirement:** REQ-02 | **AC:** AC-01 | **Type:** boundary | **Layer:** UI | **Priority:** P2
- **Tags:** boundary, req-02 | **Status:** draft

**Steps:** Submit once with Zip Code empty, once with Zip Code as only spaces.

**Expected Result:** Both are treated as missing/invalid — neither passes as a valid Zip Code (whitespace-only must not be silently trimmed-and-accepted as empty-but-valid).

---

## TC-011 — Positive: WhatsApp Selected Reveals Required WhatsApp Number Field — REQ-03

- **Requirement:** REQ-03 | **AC:** AC-01 | **Type:** positive | **Layer:** UI | **Priority:** P0
- **Tags:** regression, req-03 | **Status:** draft

**Steps:** Select Contact Media = "WhatsApp". Observe form. Fill WhatsApp Number. Submit with rest valid.

**Expected Result:** WhatsApp Number field appears and is required; Messenger Account Name/Link fields are hidden and not required. Submission succeeds.

---

## TC-012 — Positive: Messenger Selected Reveals Required Messenger Fields — REQ-03

- **Requirement:** REQ-03 | **AC:** AC-01 | **Type:** positive | **Layer:** UI | **Priority:** P0
- **Tags:** regression, req-03 | **Status:** draft

**Steps:** Select Contact Media = "Messenger". Fill Messenger Account Name & Link. Submit with rest valid.

**Expected Result:** Messenger fields appear and are required; WhatsApp Number field is hidden and not required. Submission succeeds.

---

## TC-013 — Edge: Toggling WhatsApp → Messenger Clears WhatsApp Value — REQ-03

- **Requirement:** REQ-03 | **AC:** AC-01 | **Type:** edge | **Layer:** UI | **Priority:** P1
- **Tags:** edge, regression, req-03 | **Status:** draft

**Steps:** Select "WhatsApp", fill WhatsApp Number, then switch Contact Media to "Messenger". Fill Messenger fields. Submit.

**Expected Result:** The WhatsApp Number field is cleared/hidden and its stale value is not submitted alongside the Messenger data — the backend only receives the fields matching the final Contact Media selection.

---

## TC-014 — Negative: WhatsApp Selected but Number Left Blank — REQ-03

- **Requirement:** REQ-03 | **AC:** AC-01 | **Type:** negative | **Layer:** UI | **Priority:** P1
- **Tags:** regression, validation, req-03 | **Status:** draft

**Steps:** Select "WhatsApp", leave WhatsApp Number blank, submit with rest valid.

**Expected Result:** Validation error on WhatsApp Number; submission blocked.

---

## TC-015 — Positive: Valid Account Setup Fields Accepted — REQ-04

- **Requirement:** REQ-04 | **AC:** AC-01 | **Type:** positive | **Layer:** UI | **Priority:** P0
- **Tags:** regression, req-04 | **Status:** draft

**Steps:** Fill Username, Password, matching Confirm Password, "How did you hear about us?", and "Tell us about your business". Submit with rest valid.

**Expected Result:** All fields accepted, no validation errors on this section.

---

## TC-016 — Negative: Password / Confirm Password Mismatch — REQ-04

- **Requirement:** REQ-04 | **AC:** AC-01 | **Type:** negative | **Layer:** UI | **Priority:** P0
- **Tags:** regression, validation, req-04 | **Status:** draft

**Steps:** Enter differing values in Password and Confirm Password, submit with rest valid.

**Expected Result:** Validation error indicating passwords do not match; submission blocked.

---

## TC-017 — Boundary: Empty Password Field — REQ-04

- **Requirement:** REQ-04 | **AC:** AC-01 | **Type:** boundary | **Layer:** UI | **Priority:** P1
- **Tags:** boundary, regression, req-04 | **Status:** draft

**Steps:** Leave Password (and Confirm Password) blank, submit with rest valid.

**Expected Result:** Validation error requiring a password; submission blocked.

---

## TC-018 — Edge: Username With Special Characters / Spaces — REQ-04

- **Requirement:** REQ-04 | **AC:** AC-01 | **Type:** edge | **Layer:** UI | **Priority:** P2
- **Tags:** edge, req-04 | **Status:** draft

**Steps:** Enter a Username containing a space and a symbol (e.g. `qa user#1`), submit.

**Expected Result:** Observed live during Stage 4 — either rejected with a clear validation error, or accepted/normalized consistently (whichever the live app actually does; this test exists to pin down and lock in that real behavior, not assume it).

---

## TC-019 — Positive: All 3 Required Checkboxes Checked Allows Submission — REQ-05

- **Requirement:** REQ-05 | **AC:** AC-01 | **Type:** positive | **Layer:** UI | **Priority:** P0
- **Tags:** regression, req-05 | **Status:** draft

> **Corrected during Stage 4:** "Wholesale Account Agreement" is display text above the checkboxes (order-minimum, pricing-confidentiality terms), not a 4th checkbox. Only 3 real checkboxes exist.

**Steps:** Check Terms of Service, Privacy Policy, and 18+ Age confirmation. Submit with rest valid.

**Expected Result:** Submission proceeds (no agreement-related blocking).

---

## TC-020 — Negative: Terms of Service Unchecked Blocks Submission — REQ-05

- **Requirement:** REQ-05 | **AC:** AC-01 | **Type:** negative | **Layer:** UI | **Priority:** P0
- **Tags:** regression, validation, req-05 | **Status:** draft

**Steps:** Leave Terms of Service unchecked, check the other 2 required checkboxes (Privacy Policy, 18+ Age), submit.

**Expected Result:** Submission blocked with an error indicating ToS acceptance is required.

---

## TC-021 — Edge: Only 18+ Age Confirmation Unchecked — REQ-05

- **Requirement:** REQ-05 | **AC:** AC-01 | **Type:** edge | **Layer:** UI | **Priority:** P1
- **Tags:** edge, regression, req-05 | **Status:** draft

**Steps:** Check ToS and Privacy Policy; leave 18+ Age confirmation unchecked; submit.

**Expected Result:** Submission blocked specifically citing the age confirmation — confirms each of the 4 agreements is independently enforced, not just "any 3 of 4."

---

## TC-022 — Positive: Brand-New Unique Email/Username Pass Uniqueness Check — REQ-06

- **Requirement:** REQ-06 | **AC:** AC-02 | **Type:** positive | **Layer:** UI | **Priority:** P1
- **Tags:** regression, req-06 | **Status:** draft

**Steps:** Submit a fully valid form with a freshly generated, never-used email and username.

**Expected Result:** No uniqueness-related validation error; submission proceeds to entity creation (same outcome as TC-001).

---

## TC-023 — Negative: Duplicate Email Blocks Submission — REQ-06

- **Requirement:** REQ-06 | **AC:** AC-02 | **Type:** negative | **Layer:** UI | **Priority:** P0
- **Tags:** smoke, regression, validation, req-06 | **Status:** draft

**Preconditions:** `userKBD@gmail.com` is a confirmed existing wholesale account (per project owner).

**Steps:** Fill Step 1 fields using `userKBD@gmail.com` as the Email, click "Next" (Step 1 → Step 2).

**Expected Result:** Blocked at Step 1 — never reaches Step 2. Exact captured text: **"An account with this email address already exists."** (verbatim, from `workflows/b2b-registration.verify.json`).

---

## TC-024 — Negative: Duplicate Username Blocks Submission — REQ-06

- **Requirement:** REQ-06 | **AC:** AC-02 | **Type:** negative | **Layer:** UI | **Priority:** P0
- **Tags:** regression, validation, req-06 | **Status:** draft

**Steps:** Fill the form using a fresh Email but a Username known to already exist, submit.

**Expected Result:** Submission blocked; clear validation error stating the username is already in use.

---

## TC-025 — Edge: Case-Variant Duplicate Email — REQ-06

- **Requirement:** REQ-06 | **AC:** AC-02 | **Type:** edge | **Layer:** UI | **Priority:** P2
- **Tags:** edge, req-06 | **Status:** draft

**Steps:** Submit using `UserKBD@gmail.com` (different casing of the known existing `userKBD@gmail.com`).

**Expected Result:** Observed live during Stage 4 — confirms whether the uniqueness check is case-insensitive (expected for email addresses) and locks in the actual behavior.

---

## TC-026 — Positive: Admin Sees Full Submitted Data in Registration Applications — REQ-07

- **Requirement:** REQ-07 | **AC:** AC-03 | **Type:** positive | **Layer:** UI | **Priority:** P0
- **Tags:** regression, req-07 | **Status:** draft

**Preconditions:** A wholesale application has been submitted (e.g. via TC-001). Admin session active (`tests/.auth/admin.json`).

> **Corrected during Stage 4 Live Exploration:** the requirement originally described a "KD Registration Details" section on the customer's own profile page. Live verification found no such section there (checked page text and tab structure directly). The confirmed real location — per owner decision — is **Admin → Advanced B2B/B2C → Registration Applications** (`/Admin/ErpRegistrationApplication/List`), a dedicated grid, not a section embedded in the customer edit page.

**Steps:** Log in as admin → Advanced B2B/B2C (sidebar) → Registration Applications → search/locate the applicant's entry (by Accounts Email or Full Registered Name) → open/view the entry.

**Expected Result:** The Registration Applications entry displays the submitted wholesale data (Company Info, Type of Business, Contact Media, Position, 18+ Age confirmation, Account Setup answers) matching exactly what was submitted in TC-001, alongside ERP-side fields (Registration Number, VAT Number, Credit Limit Required) the storefront form doesn't collect directly.

---

## TC-027 — Edge: Registration Applications List Handles No-Match / Empty State — REQ-07

- **Requirement:** REQ-07 | **AC:** AC-03 | **Type:** edge | **Layer:** UI | **Priority:** P2
- **Tags:** edge, req-07 | **Status:** draft

**Steps:** As admin, search the Registration Applications grid for an email/name with no matching application.

**Expected Result:** The grid shows a clean "no records" state — no error, crash, or stale data from another applicant.

---

## TC-028 — Positive: Admin Activates Account — Login Enabled, Welcome Email Sent — REQ-08

- **Requirement:** REQ-08 | **AC:** AC-04 | **Type:** positive | **Layer:** UI | **Priority:** P0
- **Tags:** smoke, regression, req-08 | **Status:** draft

**Preconditions:** A pending inactive account exists (from TC-001), already mapped to its ERP account.

**Steps:** As admin, navigate to Customers → Active filter "All" → Select All → locate the inactive registrant → open profile → check "Active" → Save.

**Expected Result:**
- **Data State:** Customer account becomes fully active.
- Customer can now log in with their registered credentials and access pre-mapped B2B features.
- A welcome/activation email is sent automatically (verify via observable signal — e.g. an email-sent confirmation/log if the app surfaces one; flag as a testing limitation in Stage 4 if there's no E2E-observable signal without a mail server).

---

## TC-029 — Negative: Login Before Admin Approval Is Blocked — REQ-08

- **Requirement:** REQ-08 | **AC:** AC-04 | **Type:** negative | **Layer:** UI | **Priority:** P0
- **Tags:** regression, validation, req-08 | **Status:** draft

**Preconditions:** A newly registered account exists, still inactive (not yet approved).

**Steps:** Attempt to log in at `/login` with the new account's credentials.

**Expected Result:** Login is blocked; a message indicates the account is not yet active/awaiting approval (exact text captured live in Stage 4).

---

## TC-030 — Edge: Admin Deactivates a Previously-Active Account — REQ-08

- **Requirement:** REQ-08 | **AC:** AC-04 | **Type:** edge | **Layer:** UI | **Priority:** P2
- **Tags:** edge, req-08 | **Status:** draft

**Preconditions:** An account previously activated via TC-028.

**Steps:** As admin, open the now-active customer's profile, uncheck "Active", Save. Attempt to log in as that customer.

**Expected Result:** Account becomes inactive again; subsequent login attempt is blocked the same way as TC-029 — confirms the Active flag is a live gate, not a one-way activation.
