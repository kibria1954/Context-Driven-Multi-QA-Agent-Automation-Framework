# Live Verification Log — B2B Registration

**Feature:** `b2b-registration` | **Environment:** staging (`https://kbd.nop-station.site`) | **Verified:** 2026-08-15
**Method:** Playwright script driven directly (headless Chromium) — the Claude-in-Chrome browser extension was unavailable this session (permission-prompt timeout), so live exploration used the project's own Playwright installation instead, per `AGENTS.md`'s Rule 4 (read the exact skill schema) applied to *how* verification is captured, not just what.

---

## Overall Status: ✅ VERIFIED — with 3 requirement corrections and 1 workflow-timing correction

### Selector Drift Check
Every field selector already in `utils/selectors.ts` (`REGISTER_SELECTORS`) was cross-checked against the live DOM and **confirmed still accurate** — no drift. Two admin-side selector families were newly discovered and added: `#SearchIsActive` (customer grid filter) and the Registration Applications grid.

### Requirement Corrections (self-corrected per Section 7 of `04-live-explorer/SKILL.md`)

1. **Agreements count: 3, not 4.** "Wholesale Account Agreement" is display text above the checkboxes (order-minimum/pricing-confidentiality terms), not a checkbox itself. Only Terms of Service, Privacy Policy, and 18+ Age confirmation are real checkboxes. → `requirements/b2b-registration/parsed.json` REQ-05, `testcases/b2b-registration.tc.md` TC-019/020/021 updated.
2. **"KD Registration Details" section does not exist on the customer's own profile page.** The confirmed real location — **Admin → Advanced B2B/B2C → Registration Applications** (`/Admin/ErpRegistrationApplication/List`) — is a separate dedicated grid with additional ERP-side fields (Registration Number, VAT Number, Credit Limit Required) the storefront form doesn't collect. Confirmed with the project owner. → REQ-07, TC-026/027 updated.
3. **Two extra fields exist that the requirement doesn't mention:** `DateOfBirth` (labeled "optional") and `MarketingOptIn` (optional). Neither is required or related to the 18+ agreement. No test-case changes needed — both are low-risk, non-blocking additions.

### Workflow-Timing Correction

Step 1 field validation — **including the email/username uniqueness check** — fires when clicking **"Next" (Step 1 → Step 2)**, not at the final "Submit Application" button on Step 3. This affects how TC-003, 006, 007, 008, 009, 010, 023, 024, 025 must be scripted in Stage 5 (fill Step 1, click Next, assert blocked — not fill entire 3-step form then submit).

---

## Verbatim Text Captured (replacing earlier paraphrases)

| Scenario | Exact Text |
|---|---|
| Successful submission | *"Application Submitted. Thank you for applying for a wholesale account. Your application is under review and you will be notified by email once it has been approved."* |
| Missing Company Name | *"Company name is required."* |
| Duplicate email | *"An account with this email address already exists."* |
| Login before approval | *"Login was unsuccessful. Please correct the errors and try again. Account is not active"* |
| Admin saves customer | *"The customer has been updated successfully."* |

---

## Full Happy-Path Lifecycle — Confirmed End-to-End Live

Ran the complete chain against real staging data (Stage 0's synthetic customer, `qatest.1786730626271.1k4ubg@qa-test.example.com`):

1. Submitted full valid registration → `/register/result`, success text confirmed.
2. Found in Admin → Customers with `Is Active = No` filter (per the project owner's original navigation note) → correctly tagged `B2B Customer` role.
3. Admin checked `#Active`, saved → *"The customer has been updated successfully."*
4. Logged in as the customer post-approval → succeeded (homepage shows authenticated session, "Anika Mia" in header, wishlist/cart visible).

This is real, live confirmation of REQ-01 and REQ-08 working correctly end-to-end — not an assumption.

## Known Limitation

**Welcome/activation email (part of REQ-08):** no observable in-app signal was found to confirm the email was actually sent. This stays untestable via E2E browser automation without mail-server access — documented as a limitation in `workflows/b2b-registration.journey.json`'s `asyncHandlers`, not silently assumed to pass.

## Modal Handling Note

The welcome/announcement overlay (`#kdn-welcome-modal`) intercepted clicks when dismissed via its close button — timing-sensitive, unreliable. Switched to the **TRUSTED** pattern already in `memory/healed-patterns.json` (`PAT-MODAL-002`: evaluate DOM removal + reset body overflow) per this project's own pre-flight rule to check trusted patterns before inventing a new approach — worked reliably every time after.

## Visual Baselines Captured

- `workflows/b2b-registration/visual/registration-step1-initial.png`
- `workflows/b2b-registration/visual/registration-step3-agreements.png`
- `workflows/b2b-registration/visual/registration-success.png`
- `workflows/b2b-registration/visual/admin-customer-edit.png`
- `workflows/b2b-registration/visual/admin-registration-applications.png`
