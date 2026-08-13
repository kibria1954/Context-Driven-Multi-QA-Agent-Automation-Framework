/**
 * Test Suite: B2B Wholesale Customer Registration & Admin Approval Workflow
 *
 * Requirements Covered:
 *   - REQ-01: Successful B2B Registration Form Submission & Entity Creation
 *   - REQ-02: Uniqueness Validation During Registration
 *   - REQ-03: Admin Reviews Wholesale Application Details
 *   - REQ-04: Admin Approves and Activates B2B Account
 *   - REQ-05: Password Mismatch & Field Format Validation
 *   - REQ-06: Dynamic Contact Channel Toggle & Field Clear Validation
 *
 * Uses:
 *   - Custom fixtures ({ registerPage, adminLoginPage, adminCustomerDetailsPage })
 *   - Dynamic faker data generator (generateDynamicB2BRegistrationData)
 *   - Centralized selectors & POM design pattern
 */
import { test, expect } from '../../fixtures/custom-fixtures';
import { generateDynamicB2BRegistrationData, B2BRegistrationData } from '../../../pages/register.page';
import { ENV } from '../../../utils/env';

// Track dynamically generated customer data across scenarios
let registeredCustomer: B2BRegistrationData;

test.describe('B2B Wholesale Registration & Approval Pipeline', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(60000); // 60s timeout for admin workflows

  test.beforeEach(async ({ registerPage }, testInfo) => {
    if (!testInfo.title.includes('@admin')) {
      await registerPage.navigate();
    }
  });

  // ─── Scenario 1: Successful B2B Registration Form Submission ───────────────

  test('TC-REG-001: Positive: Successful B2B Registration Form Submission & Entity Creation @smoke @regression @REQ-01', async ({ registerPage }) => {
    registeredCustomer = generateDynamicB2BRegistrationData({
      companyName: 'Apex Beauty Importers Ltd',
      typeOfBusiness: 'Wholesaler (Online page)',
      preferredContactChannel: 'WhatsApp',
      howDidYouHearAboutUs: 'Google Search',
    });

    console.log(`\n📋 Registering new B2B customer: ${registeredCustomer.email} (${registeredCustomer.username})`);
    await registerPage.fillCompleteB2BRegistrationForm(registeredCustomer);
    await registerPage.submitRegistration();
    await registerPage.assertRegistrationSuccess();
  });

  // ─── Scenario 2: Uniqueness Validation for Duplicate Email/Username ──────

  test('TC-REG-002: Negative: Uniqueness Validation for Duplicate Email/Username @regression @REQ-02', async ({ registerPage }) => {
    await registerPage.attemptDuplicateRegistration(ENV.CUSTOMER_EMAIL);
    await registerPage.assertDuplicateEmailError();
  });

  // ─── Scenario 3: Admin Reviews Wholesale Application Details ──────────────

  test('TC-REG-003: Positive: Admin Reviews Wholesale Application Details @admin @regression @REQ-03', async ({ adminLoginPage, adminCustomerDetailsPage }) => {
    test.skip(!registeredCustomer, 'Requires a customer registered in TC-REG-001');

    await adminLoginPage.navigate();
    await adminLoginPage.loginAsAdmin();
    await adminCustomerDetailsPage.searchAndOpenCustomer(registeredCustomer.email);
    await adminCustomerDetailsPage.assertKdRegistrationDetailsDisplayed();
    await adminCustomerDetailsPage.assertWholesaleDetailContains('Type of Business', registeredCustomer.typeOfBusiness);
    await adminCustomerDetailsPage.assertWholesaleDetailContains('Position', registeredCustomer.position);
  });

  // ─── Scenario 4: Admin Approves and Activates B2B Account ─────────────────

  test('TC-REG-004: Positive: Admin Approves and Activates B2B Account @admin @regression @REQ-04', async ({ adminLoginPage, adminCustomerDetailsPage }) => {
    test.skip(!registeredCustomer, 'Requires a customer registered in TC-REG-001');

    await adminLoginPage.navigate();
    await adminLoginPage.loginAsAdmin();
    await adminCustomerDetailsPage.searchAndOpenCustomer(registeredCustomer.email);
    await adminCustomerDetailsPage.approveAndActivateAccount();
    await adminCustomerDetailsPage.assertSaveSuccess();
    await adminCustomerDetailsPage.assertAccountIsActive();
  });

  // ─── Scenario 5: Password Mismatch & Field Format Validation ──────────────

  test('TC-REG-005: Negative: Password Mismatch Validation @regression @REQ-05', async ({ registerPage }) => {
    const invalidData = generateDynamicB2BRegistrationData({
      password: 'SecretPassword123!',
      confirmPassword: 'MismatchPassword999!',
    });

    await registerPage.fillStep1(invalidData);
    await registerPage.goToNextStep();
    await registerPage.fillStep2(invalidData);
    await registerPage.goToNextStep();
    await registerPage.assertValidationError();
  });

  // ─── Scenario 6: Boundary Invalid BD Mobile Format ────────────────────────

  test('TC-REG-006: Boundary: Invalid BD Mobile Format @boundary @regression @REQ-05', async ({ registerPage }) => {
    const invalidData = generateDynamicB2BRegistrationData({
      phone: '0171122334', // Invalid 10-digit mobile
    });

    await registerPage.fillStep1(invalidData);
    await registerPage.goToNextStep();
    await registerPage.assertValidationError();
  });

  // ─── Scenario 7: Dynamic Contact Channel Toggle & Field Clear ─────────────

  test('TC-REG-007: Positive/UI: Dynamic Contact Channel Toggle & Field Clear Validation @ui @regression @REQ-06', async ({ registerPage }) => {
    const channelData = generateDynamicB2BRegistrationData({
      preferredContactChannel: 'WhatsApp',
      whatsAppNumber: '01812345678',
    });

    await registerPage.fillStep1(channelData);
    await expect(registerPage.whatsAppNumberInput).toBeVisible();

    await registerPage.fillStep1({ preferredContactChannel: 'Messenger', messengerAccountName: 'test.user' });
    await expect(registerPage.messengerAccountNameInput).toBeVisible();
  });

  // ─── Scenario 8: Negative Missing Required Agreement Checkboxes ───────────

  test('TC-REG-008: Negative: Missing Required Agreement Checkboxes Validation @validation @regression @REQ-01', async ({ registerPage }) => {
    const data = generateDynamicB2BRegistrationData();
    await registerPage.fillStep1(data);
    await registerPage.goToNextStep();
    await registerPage.fillStep2(data);
    await registerPage.goToNextStep();

    // Leave terms unchecked and submit
    await registerPage.submitRegistration();
    await registerPage.assertValidationError();
  });

  // ─── Scenario 9: Negative Invalid Email Format Validation ─────────────────

  test('TC-REG-009: Negative: Invalid Email Format Validation @validation @regression @REQ-02', async ({ registerPage }) => {
    await registerPage.attemptDuplicateRegistration('invalid.email.without.at.com');
    await registerPage.assertValidationError();
  });

  // ─── Scenario 10: Edge Special Characters in Company Name ──────────────────

  test('TC-REG-010: Edge: Special Characters in Company Name & Dynamic Sanitization @edge @regression @REQ-01', async ({ registerPage }) => {
    const specialData = generateDynamicB2BRegistrationData({
      companyName: "Apex & Co. <Beauty> 'Ltd'",
    });

    await registerPage.fillStep1(specialData);
    await expect(registerPage.companyNameInput).toHaveValue("Apex & Co. <Beauty> 'Ltd'");
  });

});
