# Automation Journeys — b2b-registration

> Generated: 2026-08-10T08:59:40.136Z
> Total: 187 journeys

---

## JOURNEY-001 — REQ-01 — Happy Path: As a new wholesale buyer, I want to register for a B2B whole
- **Test Cases:** TC-001
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[RegisterPage]** Navigate to page
   → Expected: Page loaded
3. **[RegisterPage]** Enter valid data
   → Expected: Data entered
4. **[RegisterPage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[RegisterPage]** Verify: Successfully: As a new wholesale buyer, I want to register f
   → Expected: Successfully: As a new wholesale buyer, I want to register for a B2B wholesale account on the 

---

## JOURNEY-002 — REQ-01 — Invalid Input: As a new wholesale buyer, I want to register for a B2B whole
- **Test Cases:** TC-002
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[RegisterPage]** Navigate to page
   → Expected: Page loaded
3. **[RegisterPage]** Enter invalid data
   → Expected: Data entered
4. **[RegisterPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[RegisterPage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-003 — REQ-01 — Edge/Boundary: As a new wholesale buyer, I want to register for a B2B whole
- **Test Cases:** TC-003
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[RegisterPage]** Navigate to page
   → Expected: Page loaded
3. **[RegisterPage]** Enter boundary/special data
   → Expected: Data entered
4. **[RegisterPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[RegisterPage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-004 — Security: SQL Injection — REQ-01
- **Test Cases:** TC-004
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter sql_injection payload (Data: `' OR '1'='1`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-005 — Security: XSS — REQ-01
- **Test Cases:** TC-005
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter xss payload (Data: `<script>alert('xss')</script>`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-006 — REQ-02 — Happy Path: **Given** the user is on the public store and navigates to t
- **Test Cases:** TC-006
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **Given** the user is on the public store and 
   → Expected: Successfully: **Given** the user is on the public store and navigates to the registration page

---

## JOURNEY-007 — REQ-02 — Invalid Input: **Given** the user is on the public store and navigates to t
- **Test Cases:** TC-007
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-008 — REQ-02 — Edge/Boundary: **Given** the user is on the public store and navigates to t
- **Test Cases:** TC-008
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-009 — Security: SQL Injection — REQ-02
- **Test Cases:** TC-009
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter sql_injection payload (Data: `' OR '1'='1`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-010 — Security: XSS — REQ-02
- **Test Cases:** TC-010
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter xss payload (Data: `<script>alert('xss')</script>`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-011 — REQ-03 — Happy Path: **When** the user fills in all required fields including:
- **Test Cases:** TC-011
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **When** the user fills in all required fields
   → Expected: Successfully: **When** the user fills in all required fields including:

---

## JOURNEY-012 — REQ-03 — Invalid Input: **When** the user fills in all required fields including:
- **Test Cases:** TC-012
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-013 — REQ-03 — Edge/Boundary: **When** the user fills in all required fields including:
- **Test Cases:** TC-013
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-014 — REQ-04 — Happy Path: **Company Info**:
- **Test Cases:** TC-014
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **Company Info**:
   → Expected: Successfully: **Company Info**:

---

## JOURNEY-015 — REQ-04 — Invalid Input: **Company Info**:
- **Test Cases:** TC-015
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-016 — REQ-04 — Edge/Boundary: **Company Info**:
- **Test Cases:** TC-016
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-017 — REQ-05 — Happy Path: Company Name (required text)
- **Test Cases:** TC-017
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Company Name (required text)
   → Expected: Successfully: Company Name (required text)

---

## JOURNEY-018 — REQ-05 — Invalid Input: Company Name (required text)
- **Test Cases:** TC-018
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-019 — REQ-05 — Edge/Boundary: Company Name (required text)
- **Test Cases:** TC-019
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-020 — REQ-06 — Happy Path: Type of Business (required dropdown with values: `Retailer (
- **Test Cases:** TC-020
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Type of Business (required dropdown with value
   → Expected: Successfully: Type of Business (required dropdown with values: `Retailer (Online page only)`, 

---

## JOURNEY-021 — REQ-06 — Invalid Input: Type of Business (required dropdown with values: `Retailer (
- **Test Cases:** TC-021
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-022 — REQ-06 — Edge/Boundary: Type of Business (required dropdown with values: `Retailer (
- **Test Cases:** TC-022
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-023 — REQ-07 — Happy Path: Email (required valid email)
- **Test Cases:** TC-023
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Email (required valid email)
   → Expected: Successfully: Email (required valid email)

---

## JOURNEY-024 — REQ-07 — Invalid Input: Email (required valid email)
- **Test Cases:** TC-024
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-025 — REQ-07 — Edge/Boundary: Email (required valid email)
- **Test Cases:** TC-025
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-026 — Security: SQL Injection — REQ-07
- **Test Cases:** TC-026
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter sql_injection payload (Data: `' OR '1'='1`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-027 — Security: XSS — REQ-07
- **Test Cases:** TC-027
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter xss payload (Data: `<script>alert('xss')</script>`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-028 — REQ-08 — Happy Path: Phone Number (required 11-digit BD mobile number starting wi
- **Test Cases:** TC-028
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Phone Number (required 11-digit BD mobile numb
   → Expected: Successfully: Phone Number (required 11-digit BD mobile number starting with 01)

---

## JOURNEY-029 — REQ-08 — Invalid Input: Phone Number (required 11-digit BD mobile number starting wi
- **Test Cases:** TC-029
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-030 — REQ-08 — Edge/Boundary: Phone Number (required 11-digit BD mobile number starting wi
- **Test Cases:** TC-030
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-031 — REQ-09 — Happy Path: Website / Facebook Page URL (optional text)
- **Test Cases:** TC-031
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Website / Facebook Page URL (optional text)
   → Expected: Successfully: Website / Facebook Page URL (optional text)

---

## JOURNEY-032 — REQ-09 — Invalid Input: Website / Facebook Page URL (optional text)
- **Test Cases:** TC-032
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-033 — REQ-09 — Edge/Boundary: Website / Facebook Page URL (optional text)
- **Test Cases:** TC-033
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-034 — REQ-10 — Happy Path: Address Line 1 (required text)
- **Test Cases:** TC-034
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Address Line 1 (required text)
   → Expected: Successfully: Address Line 1 (required text)

---

## JOURNEY-035 — REQ-10 — Invalid Input: Address Line 1 (required text)
- **Test Cases:** TC-035
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-036 — REQ-10 — Edge/Boundary: Address Line 1 (required text)
- **Test Cases:** TC-036
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-037 — REQ-11 — Happy Path: Address Line 2 (optional text)
- **Test Cases:** TC-037
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Address Line 2 (optional text)
   → Expected: Successfully: Address Line 2 (optional text)

---

## JOURNEY-038 — REQ-11 — Invalid Input: Address Line 2 (optional text)
- **Test Cases:** TC-038
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-039 — REQ-11 — Edge/Boundary: Address Line 2 (optional text)
- **Test Cases:** TC-039
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-040 — REQ-12 — Happy Path: City (required text)
- **Test Cases:** TC-040
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: City (required text)
   → Expected: Successfully: City (required text)

---

## JOURNEY-041 — REQ-12 — Invalid Input: City (required text)
- **Test Cases:** TC-041
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-042 — REQ-12 — Edge/Boundary: City (required text)
- **Test Cases:** TC-042
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-043 — REQ-13 — Happy Path: State / Division (required text)
- **Test Cases:** TC-043
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: State / Division (required text)
   → Expected: Successfully: State / Division (required text)

---

## JOURNEY-044 — REQ-13 — Invalid Input: State / Division (required text)
- **Test Cases:** TC-044
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-045 — REQ-13 — Edge/Boundary: State / Division (required text)
- **Test Cases:** TC-045
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-046 — REQ-14 — Happy Path: ZIP Code (optional text)
- **Test Cases:** TC-046
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: ZIP Code (optional text)
   → Expected: Successfully: ZIP Code (optional text)

---

## JOURNEY-047 — REQ-14 — Invalid Input: ZIP Code (optional text)
- **Test Cases:** TC-047
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-048 — REQ-14 — Edge/Boundary: ZIP Code (optional text)
- **Test Cases:** TC-048
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-049 — REQ-15 — Happy Path: **Contact Details**:
- **Test Cases:** TC-049
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **Contact Details**:
   → Expected: Successfully: **Contact Details**:

---

## JOURNEY-050 — REQ-15 — Invalid Input: **Contact Details**:
- **Test Cases:** TC-050
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-051 — REQ-15 — Edge/Boundary: **Contact Details**:
- **Test Cases:** TC-051
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-052 — REQ-16 — Happy Path: Contact Name (required text)
- **Test Cases:** TC-052
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Contact Name (required text)
   → Expected: Successfully: Contact Name (required text)

---

## JOURNEY-053 — REQ-16 — Invalid Input: Contact Name (required text)
- **Test Cases:** TC-053
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-054 — REQ-16 — Edge/Boundary: Contact Name (required text)
- **Test Cases:** TC-054
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-055 — REQ-17 — Happy Path: Position (required text)
- **Test Cases:** TC-055
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Position (required text)
   → Expected: Successfully: Position (required text)

---

## JOURNEY-056 — REQ-17 — Invalid Input: Position (required text)
- **Test Cases:** TC-056
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-057 — REQ-17 — Edge/Boundary: Position (required text)
- **Test Cases:** TC-057
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-058 — REQ-18 — Happy Path: Preferred Contact Channel (required dropdown: `Whatsapp`, `M
- **Test Cases:** TC-058
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Preferred Contact Channel (required dropdown: 
   → Expected: Successfully: Preferred Contact Channel (required dropdown: `Whatsapp`, `Messenger`)

---

## JOURNEY-059 — REQ-18 — Invalid Input: Preferred Contact Channel (required dropdown: `Whatsapp`, `M
- **Test Cases:** TC-059
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-060 — REQ-18 — Edge/Boundary: Preferred Contact Channel (required dropdown: `Whatsapp`, `M
- **Test Cases:** TC-060
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-061 — REQ-19 — Happy Path: If `Whatsapp` is selected: WhatsApp number (required 11-digi
- **Test Cases:** TC-061
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: If `Whatsapp` is selected: WhatsApp number (re
   → Expected: Successfully: If `Whatsapp` is selected: WhatsApp number (required 11-digit BD mobile number)

---

## JOURNEY-062 — REQ-19 — Invalid Input: If `Whatsapp` is selected: WhatsApp number (required 11-digi
- **Test Cases:** TC-062
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-063 — REQ-19 — Edge/Boundary: If `Whatsapp` is selected: WhatsApp number (required 11-digi
- **Test Cases:** TC-063
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-064 — REQ-20 — Happy Path: If `Messenger` is selected: Messenger account name (required
- **Test Cases:** TC-064
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: If `Messenger` is selected: Messenger account 
   → Expected: Successfully: If `Messenger` is selected: Messenger account name (required text) & Messenger p

---

## JOURNEY-065 — REQ-20 — Invalid Input: If `Messenger` is selected: Messenger account name (required
- **Test Cases:** TC-065
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-066 — REQ-20 — Edge/Boundary: If `Messenger` is selected: Messenger account name (required
- **Test Cases:** TC-066
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-067 — REQ-21 — Happy Path: **Account Setup**:
- **Test Cases:** TC-067
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **Account Setup**:
   → Expected: Successfully: **Account Setup**:

---

## JOURNEY-068 — REQ-21 — Invalid Input: **Account Setup**:
- **Test Cases:** TC-068
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-069 — REQ-21 — Edge/Boundary: **Account Setup**:
- **Test Cases:** TC-069
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-070 — REQ-22 — Happy Path: Username (required text)
- **Test Cases:** TC-070
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Username (required text)
   → Expected: Successfully: Username (required text)

---

## JOURNEY-071 — REQ-22 — Invalid Input: Username (required text)
- **Test Cases:** TC-071
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-072 — REQ-22 — Edge/Boundary: Username (required text)
- **Test Cases:** TC-072
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-073 — REQ-23 — Happy Path: Password (required text)
- **Test Cases:** TC-073
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Password (required text)
   → Expected: Successfully: Password (required text)

---

## JOURNEY-074 — REQ-23 — Invalid Input: Password (required text)
- **Test Cases:** TC-074
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-075 — REQ-23 — Edge/Boundary: Password (required text)
- **Test Cases:** TC-075
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-076 — Security: SQL Injection — REQ-23
- **Test Cases:** TC-076
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter sql_injection payload (Data: `' OR '1'='1`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-077 — Security: XSS — REQ-23
- **Test Cases:** TC-077
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter xss payload (Data: `<script>alert('xss')</script>`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-078 — REQ-24 — Happy Path: Confirm Password (required text, must match Password)
- **Test Cases:** TC-078
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Confirm Password (required text, must match Pa
   → Expected: Successfully: Confirm Password (required text, must match Password)

---

## JOURNEY-079 — REQ-24 — Invalid Input: Confirm Password (required text, must match Password)
- **Test Cases:** TC-079
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-080 — REQ-24 — Edge/Boundary: Confirm Password (required text, must match Password)
- **Test Cases:** TC-080
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-081 — Security: SQL Injection — REQ-24
- **Test Cases:** TC-081
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter sql_injection payload (Data: `' OR '1'='1`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-082 — Security: XSS — REQ-24
- **Test Cases:** TC-082
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter xss payload (Data: `<script>alert('xss')</script>`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-083 — REQ-25 — Happy Path: How did you hear about us? (dropdown with values: `Google Se
- **Test Cases:** TC-083
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: How did you hear about us? (dropdown with valu
   → Expected: Successfully: How did you hear about us? (dropdown with values: `Google Search`, `Facebook`, `

---

## JOURNEY-084 — REQ-25 — Invalid Input: How did you hear about us? (dropdown with values: `Google Se
- **Test Cases:** TC-084
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-085 — REQ-25 — Edge/Boundary: How did you hear about us? (dropdown with values: `Google Se
- **Test Cases:** TC-085
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-086 — REQ-26 — Happy Path: Tell us about your business (optional textarea)
- **Test Cases:** TC-086
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Tell us about your business (optional textarea
   → Expected: Successfully: Tell us about your business (optional textarea)

---

## JOURNEY-087 — REQ-26 — Invalid Input: Tell us about your business (optional textarea)
- **Test Cases:** TC-087
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-088 — REQ-26 — Edge/Boundary: Tell us about your business (optional textarea)
- **Test Cases:** TC-088
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-089 — REQ-27 — Happy Path: Date of birth (optional text: mm/dd/yyyy)
- **Test Cases:** TC-089
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Date of birth (optional text: mm/dd/yyyy)
   → Expected: Successfully: Date of birth (optional text: mm/dd/yyyy)

---

## JOURNEY-090 — REQ-27 — Invalid Input: Date of birth (optional text: mm/dd/yyyy)
- **Test Cases:** TC-090
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-091 — REQ-27 — Edge/Boundary: Date of birth (optional text: mm/dd/yyyy)
- **Test Cases:** TC-091
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-092 — REQ-28 — Happy Path: **Agreements**:
- **Test Cases:** TC-092
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **Agreements**:
   → Expected: Successfully: **Agreements**:

---

## JOURNEY-093 — REQ-28 — Invalid Input: **Agreements**:
- **Test Cases:** TC-093
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-094 — REQ-28 — Edge/Boundary: **Agreements**:
- **Test Cases:** TC-094
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-095 — REQ-29 — Happy Path: Terms of Service Agreement checkbox (required)
- **Test Cases:** TC-095
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Terms of Service Agreement checkbox (required)
   → Expected: Successfully: Terms of Service Agreement checkbox (required)

---

## JOURNEY-096 — REQ-29 — Invalid Input: Terms of Service Agreement checkbox (required)
- **Test Cases:** TC-096
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-097 — REQ-29 — Edge/Boundary: Terms of Service Agreement checkbox (required)
- **Test Cases:** TC-097
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-098 — REQ-30 — Happy Path: Privacy Policy Agreement checkbox (required)
- **Test Cases:** TC-098
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Privacy Policy Agreement checkbox (required)
   → Expected: Successfully: Privacy Policy Agreement checkbox (required)

---

## JOURNEY-099 — REQ-30 — Invalid Input: Privacy Policy Agreement checkbox (required)
- **Test Cases:** TC-099
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-100 — REQ-30 — Edge/Boundary: Privacy Policy Agreement checkbox (required)
- **Test Cases:** TC-100
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-101 — REQ-31 — Happy Path: 18+ Age & Legal Authority Confirmation checkbox (required)
- **Test Cases:** TC-101
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[LoginPage]** Navigate to page
   → Expected: Page loaded
3. **[LoginPage]** Enter valid data
   → Expected: Data entered
4. **[LoginPage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[LoginPage]** Verify: Successfully: 18+ Age & Legal Authority Confirmation checkbo
   → Expected: Successfully: 18+ Age & Legal Authority Confirmation checkbox (required)

---

## JOURNEY-102 — REQ-31 — Invalid Input: 18+ Age & Legal Authority Confirmation checkbox (required)
- **Test Cases:** TC-102
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[LoginPage]** Navigate to page
   → Expected: Page loaded
3. **[LoginPage]** Enter invalid data
   → Expected: Data entered
4. **[LoginPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[LoginPage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-103 — REQ-31 — Edge/Boundary: 18+ Age & Legal Authority Confirmation checkbox (required)
- **Test Cases:** TC-103
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[LoginPage]** Navigate to page
   → Expected: Page loaded
3. **[LoginPage]** Enter boundary/special data
   → Expected: Data entered
4. **[LoginPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[LoginPage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-104 — Security: SQL Injection — REQ-31
- **Test Cases:** TC-104
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter sql_injection payload (Data: `' OR '1'='1`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-105 — Security: XSS — REQ-31
- **Test Cases:** TC-105
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter xss payload (Data: `<script>alert('xss')</script>`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-106 — REQ-32 — Happy Path: Marketing communications checkbox (optional)
- **Test Cases:** TC-106
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: Marketing communications checkbox (optional)
   → Expected: Successfully: Marketing communications checkbox (optional)

---

## JOURNEY-107 — REQ-32 — Invalid Input: Marketing communications checkbox (optional)
- **Test Cases:** TC-107
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-108 — REQ-32 — Edge/Boundary: Marketing communications checkbox (optional)
- **Test Cases:** TC-108
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-109 — REQ-33 — Happy Path: **And** clicks "Create Account"
- **Test Cases:** TC-109
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **And** clicks "Create Account"
   → Expected: Successfully: **And** clicks "Create Account"

---

## JOURNEY-110 — REQ-33 — Invalid Input: **And** clicks "Create Account"
- **Test Cases:** TC-110
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-111 — REQ-33 — Edge/Boundary: **And** clicks "Create Account"
- **Test Cases:** TC-111
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-112 — REQ-34 — Happy Path: **Then**:
- **Test Cases:** TC-112
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **Then**:
   → Expected: Successfully: **Then**:

---

## JOURNEY-113 — REQ-34 — Invalid Input: **Then**:
- **Test Cases:** TC-113
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-114 — REQ-34 — Edge/Boundary: **Then**:
- **Test Cases:** TC-114
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-115 — REQ-35 — Happy Path: The system creates a new ERP Account using the Company Name.
- **Test Cases:** TC-115
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: The system creates a new ERP Account using the
   → Expected: Successfully: The system creates a new ERP Account using the Company Name.

---

## JOURNEY-116 — REQ-35 — Invalid Input: The system creates a new ERP Account using the Company Name.
- **Test Cases:** TC-116
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-117 — REQ-35 — Edge/Boundary: The system creates a new ERP Account using the Company Name.
- **Test Cases:** TC-117
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-118 — REQ-36 — Happy Path: The system creates a Ship-To Address (Branch) using the phys
- **Test Cases:** TC-118
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: The system creates a Ship-To Address (Branch) 
   → Expected: Successfully: The system creates a Ship-To Address (Branch) using the physical address provide

---

## JOURNEY-119 — REQ-36 — Invalid Input: The system creates a Ship-To Address (Branch) using the phys
- **Test Cases:** TC-119
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-120 — REQ-36 — Edge/Boundary: The system creates a Ship-To Address (Branch) using the phys
- **Test Cases:** TC-120
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-121 — REQ-37 — Happy Path: The system creates a new B2B customer account in an "inactiv
- **Test Cases:** TC-121
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: The system creates a new B2B customer account 
   → Expected: Successfully: The system creates a new B2B customer account in an "inactive" state.

---

## JOURNEY-122 — REQ-37 — Invalid Input: The system creates a new B2B customer account in an "inactiv
- **Test Cases:** TC-122
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-123 — REQ-37 — Edge/Boundary: The system creates a new B2B customer account in an "inactiv
- **Test Cases:** TC-123
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-124 — REQ-38 — Happy Path: The system maps the new inactive customer account to the new
- **Test Cases:** TC-124
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: The system maps the new inactive customer acco
   → Expected: Successfully: The system maps the new inactive customer account to the newly created ERP accou

---

## JOURNEY-125 — REQ-38 — Invalid Input: The system maps the new inactive customer account to the new
- **Test Cases:** TC-125
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-126 — REQ-38 — Edge/Boundary: The system maps the new inactive customer account to the new
- **Test Cases:** TC-126
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-127 — REQ-39 — Happy Path: The user is redirected to a success page notifying them that
- **Test Cases:** TC-127
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: The user is redirected to a success page notif
   → Expected: Successfully: The user is redirected to a success page notifying them that their application i

---

## JOURNEY-128 — REQ-39 — Invalid Input: The user is redirected to a success page notifying them that
- **Test Cases:** TC-128
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-129 — REQ-39 — Edge/Boundary: The user is redirected to a success page notifying them that
- **Test Cases:** TC-129
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-130 — Security: SQL Injection — REQ-39
- **Test Cases:** TC-130
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter sql_injection payload (Data: `' OR '1'='1`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-131 — Security: XSS — REQ-39
- **Test Cases:** TC-131
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter xss payload (Data: `<script>alert('xss')</script>`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-132 — REQ-40 — Happy Path: **Given** the user is filling out the B2B registration form
- **Test Cases:** TC-132
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[RegisterPage]** Navigate to page
   → Expected: Page loaded
3. **[RegisterPage]** Enter valid data
   → Expected: Data entered
4. **[RegisterPage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[RegisterPage]** Verify: Successfully: **Given** the user is filling out the B2B regi
   → Expected: Successfully: **Given** the user is filling out the B2B registration form

---

## JOURNEY-133 — REQ-40 — Invalid Input: **Given** the user is filling out the B2B registration form
- **Test Cases:** TC-133
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[RegisterPage]** Navigate to page
   → Expected: Page loaded
3. **[RegisterPage]** Enter invalid data
   → Expected: Data entered
4. **[RegisterPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[RegisterPage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-134 — REQ-40 — Edge/Boundary: **Given** the user is filling out the B2B registration form
- **Test Cases:** TC-134
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[RegisterPage]** Navigate to page
   → Expected: Page loaded
3. **[RegisterPage]** Enter boundary/special data
   → Expected: Data entered
4. **[RegisterPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[RegisterPage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-135 — Security: SQL Injection — REQ-40
- **Test Cases:** TC-135
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter sql_injection payload (Data: `' OR '1'='1`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-136 — Security: XSS — REQ-40
- **Test Cases:** TC-136
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter xss payload (Data: `<script>alert('xss')</script>`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-137 — REQ-41 — Happy Path: **When** the user enters an Email address or Username that i
- **Test Cases:** TC-137
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **When** the user enters an Email address or U
   → Expected: Successfully: **When** the user enters an Email address or Username that is already registered

---

## JOURNEY-138 — REQ-41 — Invalid Input: **When** the user enters an Email address or Username that i
- **Test Cases:** TC-138
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-139 — REQ-41 — Edge/Boundary: **When** the user enters an Email address or Username that i
- **Test Cases:** TC-139
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-140 — Security: SQL Injection — REQ-41
- **Test Cases:** TC-140
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter sql_injection payload (Data: `' OR '1'='1`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-141 — Security: XSS — REQ-41
- **Test Cases:** TC-141
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter xss payload (Data: `<script>alert('xss')</script>`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-142 — REQ-42 — Happy Path: **And** clicks "Create Account"
- **Test Cases:** TC-142
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **And** clicks "Create Account"
   → Expected: Successfully: **And** clicks "Create Account"

---

## JOURNEY-143 — REQ-42 — Invalid Input: **And** clicks "Create Account"
- **Test Cases:** TC-143
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-144 — REQ-42 — Edge/Boundary: **And** clicks "Create Account"
- **Test Cases:** TC-144
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-145 — REQ-43 — Happy Path: **Then**:
- **Test Cases:** TC-145
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **Then**:
   → Expected: Successfully: **Then**:

---

## JOURNEY-146 — REQ-43 — Invalid Input: **Then**:
- **Test Cases:** TC-146
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-147 — REQ-43 — Edge/Boundary: **Then**:
- **Test Cases:** TC-147
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-148 — REQ-44 — Happy Path: The system blocks the submission.
- **Test Cases:** TC-148
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: The system blocks the submission.
   → Expected: Successfully: The system blocks the submission.

---

## JOURNEY-149 — REQ-44 — Invalid Input: The system blocks the submission.
- **Test Cases:** TC-149
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-150 — REQ-44 — Edge/Boundary: The system blocks the submission.
- **Test Cases:** TC-150
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-151 — REQ-45 — Happy Path: The system displays a validation error message indicating th
- **Test Cases:** TC-151
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: The system displays a validation error message
   → Expected: Successfully: The system displays a validation error message indicating that the Email or User

---

## JOURNEY-152 — REQ-45 — Invalid Input: The system displays a validation error message indicating th
- **Test Cases:** TC-152
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-153 — REQ-45 — Edge/Boundary: The system displays a validation error message indicating th
- **Test Cases:** TC-153
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-154 — Security: SQL Injection — REQ-45
- **Test Cases:** TC-154
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter sql_injection payload (Data: `' OR '1'='1`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-155 — Security: XSS — REQ-45
- **Test Cases:** TC-155
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter xss payload (Data: `<script>alert('xss')</script>`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-156 — REQ-46 — Happy Path: **Given** a wholesale buyer has submitted a registration app
- **Test Cases:** TC-156
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[RegisterPage]** Navigate to page
   → Expected: Page loaded
3. **[RegisterPage]** Enter valid data
   → Expected: Data entered
4. **[RegisterPage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[RegisterPage]** Verify: Successfully: **Given** a wholesale buyer has submitted a re
   → Expected: Successfully: **Given** a wholesale buyer has submitted a registration application

---

## JOURNEY-157 — REQ-46 — Invalid Input: **Given** a wholesale buyer has submitted a registration app
- **Test Cases:** TC-157
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[RegisterPage]** Navigate to page
   → Expected: Page loaded
3. **[RegisterPage]** Enter invalid data
   → Expected: Data entered
4. **[RegisterPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[RegisterPage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-158 — REQ-46 — Edge/Boundary: **Given** a wholesale buyer has submitted a registration app
- **Test Cases:** TC-158
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[RegisterPage]** Navigate to page
   → Expected: Page loaded
3. **[RegisterPage]** Enter boundary/special data
   → Expected: Data entered
4. **[RegisterPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[RegisterPage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-159 — REQ-47 — Happy Path: **When** an administrator views that customer's profile in t
- **Test Cases:** TC-159
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[AdminDashboardPage]** Navigate to page
   → Expected: Page loaded
3. **[AdminDashboardPage]** Enter valid data
   → Expected: Data entered
4. **[AdminDashboardPage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[AdminDashboardPage]** Verify: Successfully: **When** an administrator views that customer'
   → Expected: Successfully: **When** an administrator views that customer's profile in the admin portal (`/A

---

## JOURNEY-160 — REQ-47 — Invalid Input: **When** an administrator views that customer's profile in t
- **Test Cases:** TC-160
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[AdminDashboardPage]** Navigate to page
   → Expected: Page loaded
3. **[AdminDashboardPage]** Enter invalid data
   → Expected: Data entered
4. **[AdminDashboardPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[AdminDashboardPage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-161 — REQ-47 — Edge/Boundary: **When** an administrator views that customer's profile in t
- **Test Cases:** TC-161
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[AdminDashboardPage]** Navigate to page
   → Expected: Page loaded
3. **[AdminDashboardPage]** Enter boundary/special data
   → Expected: Data entered
4. **[AdminDashboardPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[AdminDashboardPage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-162 — REQ-48 — Happy Path: **Then**:
- **Test Cases:** TC-162
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **Then**:
   → Expected: Successfully: **Then**:

---

## JOURNEY-163 — REQ-48 — Invalid Input: **Then**:
- **Test Cases:** TC-163
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-164 — REQ-48 — Edge/Boundary: **Then**:
- **Test Cases:** TC-164
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-165 — REQ-49 — Happy Path: The administrator sees a dedicated "KD Registration Details"
- **Test Cases:** TC-165
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[RegisterPage]** Navigate to page
   → Expected: Page loaded
3. **[RegisterPage]** Enter valid data
   → Expected: Data entered
4. **[RegisterPage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[RegisterPage]** Verify: Successfully: The administrator sees a dedicated "KD Registr
   → Expected: Successfully: The administrator sees a dedicated "KD Registration Details" section.

---

## JOURNEY-166 — REQ-49 — Invalid Input: The administrator sees a dedicated "KD Registration Details"
- **Test Cases:** TC-166
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[RegisterPage]** Navigate to page
   → Expected: Page loaded
3. **[RegisterPage]** Enter invalid data
   → Expected: Data entered
4. **[RegisterPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[RegisterPage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-167 — REQ-49 — Edge/Boundary: The administrator sees a dedicated "KD Registration Details"
- **Test Cases:** TC-167
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[RegisterPage]** Navigate to page
   → Expected: Page loaded
3. **[RegisterPage]** Enter boundary/special data
   → Expected: Data entered
4. **[RegisterPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[RegisterPage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-168 — REQ-50 — Happy Path: The administrator is able to review all custom wholesale app
- **Test Cases:** TC-168
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[AdminDashboardPage]** Navigate to page
   → Expected: Page loaded
3. **[AdminDashboardPage]** Enter valid data
   → Expected: Data entered
4. **[AdminDashboardPage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[AdminDashboardPage]** Verify: Successfully: The administrator is able to review all custom
   → Expected: Successfully: The administrator is able to review all custom wholesale application data (Type 

---

## JOURNEY-169 — REQ-50 — Invalid Input: The administrator is able to review all custom wholesale app
- **Test Cases:** TC-169
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[AdminDashboardPage]** Navigate to page
   → Expected: Page loaded
3. **[AdminDashboardPage]** Enter invalid data
   → Expected: Data entered
4. **[AdminDashboardPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[AdminDashboardPage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-170 — REQ-50 — Edge/Boundary: The administrator is able to review all custom wholesale app
- **Test Cases:** TC-170
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[AdminDashboardPage]** Navigate to page
   → Expected: Page loaded
3. **[AdminDashboardPage]** Enter boundary/special data
   → Expected: Data entered
4. **[AdminDashboardPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[AdminDashboardPage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-171 — REQ-51 — Happy Path: **Given** a new wholesale user has a pending, inactive accou
- **Test Cases:** TC-171
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **Given** a new wholesale user has a pending, 
   → Expected: Successfully: **Given** a new wholesale user has a pending, inactive account (which is already

---

## JOURNEY-172 — REQ-51 — Invalid Input: **Given** a new wholesale user has a pending, inactive accou
- **Test Cases:** TC-172
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-173 — REQ-51 — Edge/Boundary: **Given** a new wholesale user has a pending, inactive accou
- **Test Cases:** TC-173
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-174 — REQ-52 — Happy Path: **When** the administrator reviews the application, checks t
- **Test Cases:** TC-174
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[AdminDashboardPage]** Navigate to page
   → Expected: Page loaded
3. **[AdminDashboardPage]** Enter valid data
   → Expected: Data entered
4. **[AdminDashboardPage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[AdminDashboardPage]** Verify: Successfully: **When** the administrator reviews the applica
   → Expected: Successfully: **When** the administrator reviews the application, checks the "Active" flag to 

---

## JOURNEY-175 — REQ-52 — Invalid Input: **When** the administrator reviews the application, checks t
- **Test Cases:** TC-175
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[AdminDashboardPage]** Navigate to page
   → Expected: Page loaded
3. **[AdminDashboardPage]** Enter invalid data
   → Expected: Data entered
4. **[AdminDashboardPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[AdminDashboardPage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-176 — REQ-52 — Edge/Boundary: **When** the administrator reviews the application, checks t
- **Test Cases:** TC-176
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[AdminDashboardPage]** Navigate to page
   → Expected: Page loaded
3. **[AdminDashboardPage]** Enter boundary/special data
   → Expected: Data entered
4. **[AdminDashboardPage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[AdminDashboardPage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-177 — REQ-53 — Happy Path: **Then**:
- **Test Cases:** TC-177
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: **Then**:
   → Expected: Successfully: **Then**:

---

## JOURNEY-178 — REQ-53 — Invalid Input: **Then**:
- **Test Cases:** TC-178
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-179 — REQ-53 — Edge/Boundary: **Then**:
- **Test Cases:** TC-179
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-180 — REQ-54 — Happy Path: The customer account becomes fully active, allowing the user
- **Test Cases:** TC-180
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: The customer account becomes fully active, all
   → Expected: Successfully: The customer account becomes fully active, allowing the user to log in and use t

---

## JOURNEY-181 — REQ-54 — Invalid Input: The customer account becomes fully active, allowing the user
- **Test Cases:** TC-181
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-182 — REQ-54 — Edge/Boundary: The customer account becomes fully active, allowing the user
- **Test Cases:** TC-182
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-183 — REQ-55 — Happy Path: The system sends a welcome/activation email to the customer.
- **Test Cases:** TC-183
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter valid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Success
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Successfully: The system sends a welcome/activation email to
   → Expected: Successfully: The system sends a welcome/activation email to the customer.

---

## JOURNEY-184 — REQ-55 — Invalid Input: The system sends a welcome/activation email to the customer.
- **Test Cases:** TC-184
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter invalid data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Appropriate validation error displayed
   → Expected: Appropriate validation error displayed

---

## JOURNEY-185 — REQ-55 — Edge/Boundary: The system sends a welcome/activation email to the customer.
- **Test Cases:** TC-185
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Navigate to page
   → Expected: Page loaded
3. **[HomePage]** Enter boundary/special data
   → Expected: Data entered
4. **[HomePage]** Submit / perform action
   → Expected: Validation error shown
5. **[BasePage]** Wait for AJAX to complete
   → Expected: No loading spinners visible
   → NopCommerce: `waitForAjaxComplete()`
6. **[HomePage]** Verify: Handles edge case gracefully
   → Expected: Handles edge case gracefully

---

## JOURNEY-186 — Security: SQL Injection — REQ-55
- **Test Cases:** TC-186
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter sql_injection payload (Data: `' OR '1'='1`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---

## JOURNEY-187 — Security: XSS — REQ-55
- **Test Cases:** TC-187
- **Verification:** pending

**Steps:**
1. **[BasePage]** Dismiss any popups/modals
   → Expected: No modals blocking the UI
   → NopCommerce: `dismissAllModals()`
2. **[HomePage]** Enter xss payload (Data: `<script>alert('xss')</script>`)
   → Expected: Input sanitized or rejected
3. **[HomePage]** Verify: Application handles malicious input safely
   → Expected: Application handles malicious input safely

---
