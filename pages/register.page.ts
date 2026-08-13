/**
 * RegisterPage — Page Object for the KBD NopCommerce B2B Registration Wizard.
 *
 * Handles 3-Step Wizard:
 *   Step 1: Company Info + Address + Primary Contact & Conditional Channels
 *   Step 2: Account Setup (Username, Password, How heard, About business, Date of Birth)
 *   Step 3: Agreements (Terms, Privacy, Age, Marketing) & Submit Application
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { REGISTER_SELECTORS, sel } from '../utils/selectors';
import { generateTestEmail, generateTestPhoneNumber, generateRandomString } from '../utils/helpers';

// ─── Registration Data Interface ─────────────────────────────────────────────

export interface B2BRegistrationData {
  // Step 1: Company Info
  companyName: string;
  typeOfBusiness:
    | 'Retailer (Online page only)'
    | 'Retailer (Online page + physical shop)'
    | 'Retailer (Physical shop only)'
    | 'Wholesaler (Online page)'
    | 'Wholesaler (Physical shop)'
    | 'Clinic / Pharmacy'
    | 'Salon / Parlour'
    | 'Reseller'
    | string;
  email: string;
  phone: string;
  websiteUrl?: string;

  // Step 1: Address
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateDivision: string;
  zipCode?: string;

  // Step 1: Contact
  contactName: string;
  position: string;
  preferredContactChannel: 'WhatsApp' | 'Whatsapp' | 'Messenger' | string;
  whatsAppNumber?: string;
  messengerAccountName?: string;
  messengerAccountLink?: string;

  // Step 2: Account Setup
  username: string;
  password: string;
  confirmPassword?: string;
  howDidYouHearAboutUs?:
    | 'Google Search'
    | 'Facebook'
    | 'Instagram'
    | 'TikTok'
    | 'Referred by another customer'
    | 'Visited the office'
    | 'Sales team'
    | 'Influencer / Blogger'
    | 'Other'
    | string;
  aboutBusiness?: string;
  dateOfBirth?: string; // mm/dd/yyyy

  // Step 3: Agreements
  acceptTermsOfService?: boolean;
  acceptPrivacyPolicy?: boolean;
  ageConfirmed?: boolean;
  acceptMarketing?: boolean;
}

// ─── Dynamic Data Generator (Faker alternative) ──────────────────────────────

export function generateDynamicB2BRegistrationData(overrides: Partial<B2BRegistrationData> = {}): B2BRegistrationData {
  const timestamp = Date.now();
  const phone = generateTestPhoneNumber();

  return {
    companyName: `B2B Wholesale Corp ${generateRandomString(4)}`,
    typeOfBusiness: 'Wholesaler (Online page)',
    email: generateTestEmail('b2b.buyer'),
    phone,
    websiteUrl: `https://www.b2b-test-${timestamp}.com`,
    addressLine1: `${Math.floor(Math.random() * 900 + 100)} Commercial Avenue, Block C`,
    addressLine2: `Suite ${Math.floor(Math.random() * 50 + 1)}`,
    city: 'Dhaka',
    stateDivision: 'Dhaka',
    zipCode: '1212',
    contactName: `Buyer ${generateRandomString(5)}`,
    position: 'Procurement Manager',
    preferredContactChannel: 'WhatsApp',
    whatsAppNumber: phone,
    username: `buyer_${timestamp}`,
    password: `B2B@Pass${generateRandomString(4)}!`,
    howDidYouHearAboutUs: 'Google Search',
    aboutBusiness: 'Bulk importer and wholesale distributor of beauty products in Bangladesh.',
    acceptTermsOfService: true,
    acceptPrivacyPolicy: true,
    ageConfirmed: true,
    acceptMarketing: true,
    ...overrides,
  };
}

export class RegisterPage extends BasePage {
  get path(): string {
    return '/register';
  }

  // ─── Locators ──────────────────────────────────────────────────────────────

  // Step 1: Company Info
  get companyNameInput() { return this.page.locator(sel(REGISTER_SELECTORS.companyName)); }
  get businessTypeDropdown() { return this.page.locator(sel(REGISTER_SELECTORS.businessType)); }
  get emailInput() { return this.page.locator(sel(REGISTER_SELECTORS.email)); }
  get phoneInput() { return this.page.locator(sel(REGISTER_SELECTORS.phone)); }
  get websiteUrlInput() { return this.page.locator(sel(REGISTER_SELECTORS.websiteUrl)); }

  // Step 1: Address
  get addressLine1Input() { return this.page.locator(sel(REGISTER_SELECTORS.addressLine1)); }
  get addressLine2Input() { return this.page.locator(sel(REGISTER_SELECTORS.addressLine2)); }
  get cityInput() { return this.page.locator(sel(REGISTER_SELECTORS.city)); }
  get stateDivisionInput() { return this.page.locator(sel(REGISTER_SELECTORS.stateDivision)); }
  get zipCodeInput() { return this.page.locator(sel(REGISTER_SELECTORS.zipCode)); }

  // Step 1: Contact
  get contactNameInput() { return this.page.locator(sel(REGISTER_SELECTORS.contactName)); }
  get positionInput() { return this.page.locator(sel(REGISTER_SELECTORS.position)); }
  get contactMediaDropdown() { return this.page.locator(sel(REGISTER_SELECTORS.contactMedia)); }
  get whatsAppNumberInput() { return this.page.locator(sel(REGISTER_SELECTORS.whatsAppNumber)); }
  get messengerAccountNameInput() { return this.page.locator(sel(REGISTER_SELECTORS.messengerAccountName)); }
  get messengerAccountLinkInput() { return this.page.locator(sel(REGISTER_SELECTORS.messengerAccountLink)); }

  // Step 2: Account Setup
  get usernameInput() { return this.page.locator(sel(REGISTER_SELECTORS.username)); }
  get passwordInput() { return this.page.locator(sel(REGISTER_SELECTORS.password)); }
  get confirmPasswordInput() { return this.page.locator(sel(REGISTER_SELECTORS.confirmPassword)); }
  get howDidYouHearDropdown() { return this.page.locator(sel(REGISTER_SELECTORS.howDidYouHearAboutUs)); }
  get aboutBusinessTextarea() { return this.page.locator(sel(REGISTER_SELECTORS.aboutBusiness)); }
  get dateOfBirthInput() { return this.page.locator('#DateOfBirth, input[name*="DateOfBirth"], #DateOfBirthString'); }

  // Step 3: Agreements
  get acceptTermsCheckbox() { return this.page.locator(sel(REGISTER_SELECTORS.acceptTermsOfService)); }
  get acceptPrivacyCheckbox() { return this.page.locator(sel(REGISTER_SELECTORS.acceptPrivacyPolicy)); }
  get ageConfirmedCheckbox() { return this.page.locator(sel(REGISTER_SELECTORS.ageConfirmed)); }
  get acceptMarketingCheckbox() { return this.page.locator('#AcceptMarketing, input[name*="Marketing"], #SubscribeToNewsletter'); }

  // Wizard navigation
  get nextStepButton() {
    return this.page.locator('button.kd-next-btn:visible, button.register-next-step-button:visible, button:has-text("Next"):visible').first();
  }
  get previousStepButton() {
    return this.page.locator('button.kd-prev-btn:visible, button:has-text("Previous"):visible').first();
  }
  get submitButton() {
    return this.page.locator('#kd-register-submit:visible, button.register-submit-button:visible, button:has-text("Submit"):visible, button:has-text("Create Account"):visible').first();
  }

  // Validation & Results
  get validationSummary() { return this.page.locator(sel(REGISTER_SELECTORS.validationSummary)); }
  get fieldValidationErrors() { return this.page.locator(sel(REGISTER_SELECTORS.fieldValidationError)); }
  get resultMessage() { return this.page.locator(sel(REGISTER_SELECTORS.resultMessage)); }

  // ─── Step Navigation ───────────────────────────────────────────────────────

  async hasVisibleValidationErrors(): Promise<boolean> {
    try {
      const fieldErrCount = await this.fieldValidationErrors.filter({ hasText: /\S/ }).count();
      const summaryVisible = await this.validationSummary.isVisible({ timeout: 1000 }).catch(() => false);
      return fieldErrCount > 0 || summaryVisible;
    } catch {
      return false;
    }
  }

  async goToNextStep(): Promise<boolean> {
    await this.dismissModals();
    const btn = this.nextStepButton;
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.scrollIntoViewIfNeeded();
      await btn.click();
      await this.page.waitForTimeout(1000);
      await this.waitForPageReady();
      await this.dismissModals();
      return !(await this.hasVisibleValidationErrors());
    }
    return false;
  }

  async goToPreviousStep(): Promise<void> {
    const btn = this.previousStepButton;
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click();
      await this.page.waitForTimeout(500);
      await this.waitForPageReady();
    }
  }

  // ─── Step-by-Step Form Filling ─────────────────────────────────────────────

  async fillStep1(data: Partial<B2BRegistrationData>): Promise<void> {
    await this.dismissModals();

    // Company Info
    if (data.companyName !== undefined) await this.companyNameInput.fill(data.companyName);
    if (data.typeOfBusiness) {
      const tobMap: Record<string, string> = {
        'Retailer (Online page only)': '10',
        'Retailer (Online page + physical shop)': '20',
        'Retailer (Physical shop only)': '30',
        'Wholesaler (Online page)': '40',
        'Wholesaler (Physical shop)': '50',
        'Clinic / Pharmacy': '60',
        'Salon / Parlour': '70',
        'Reseller': '80',
      };
      const val = tobMap[data.typeOfBusiness] || '40';
      await this.businessTypeDropdown.selectOption(val).catch(() =>
        this.businessTypeDropdown.selectOption({ label: data.typeOfBusiness })
      ).catch(() => {});
    }
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.websiteUrl !== undefined) await this.websiteUrlInput.fill(data.websiteUrl);

    // Address Info
    if (data.addressLine1 !== undefined) await this.addressLine1Input.fill(data.addressLine1);
    if (data.addressLine2 !== undefined) await this.addressLine2Input.fill(data.addressLine2);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.stateDivision !== undefined) await this.stateDivisionInput.fill(data.stateDivision);
    if (data.zipCode !== undefined) await this.zipCodeInput.fill(data.zipCode);

    // Contact Details
    if (data.contactName !== undefined) await this.contactNameInput.fill(data.contactName);
    if (data.position !== undefined) await this.positionInput.fill(data.position);

    // Conditional Contact Channel (WhatsApp value: 10, Messenger value: 20)
    if (data.preferredContactChannel) {
      const channelLower = data.preferredContactChannel.toLowerCase();
      const channelVal = channelLower.includes('whatsapp') ? '10' : '20';

      await this.contactMediaDropdown.selectOption(channelVal).catch(() =>
        this.contactMediaDropdown.selectOption({ label: 'WhatsApp' })
      ).catch(() =>
        this.contactMediaDropdown.selectOption({ label: 'Messenger' })
      ).catch(() => {});

      if (channelLower.includes('whatsapp') && data.whatsAppNumber !== undefined) {
        await this.whatsAppNumberInput.fill(data.whatsAppNumber);
      } else if (channelLower.includes('messenger')) {
        if (data.messengerAccountName !== undefined) {
          await this.messengerAccountNameInput.fill(data.messengerAccountName);
        }
        if (data.messengerAccountLink !== undefined) {
          await this.messengerAccountLinkInput.fill(data.messengerAccountLink);
        }
      }
    }
  }

  async fillStep2(data: Partial<B2BRegistrationData>): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    if (data.username !== undefined && await this.usernameInput.isVisible().catch(() => false)) {
      await this.usernameInput.fill(data.username);
    }
    if (data.password !== undefined && await this.passwordInput.isVisible().catch(() => false)) {
      await this.passwordInput.fill(data.password);
    }

    const confirmPwd = data.confirmPassword || data.password;
    if (confirmPwd !== undefined && await this.confirmPasswordInput.isVisible().catch(() => false)) {
      await this.confirmPasswordInput.fill(confirmPwd);
    }

    if (data.howDidYouHearAboutUs && await this.howDidYouHearDropdown.isVisible().catch(() => false)) {
      const hdyhauMap: Record<string, string> = {
        'Google Search': '10',
        'Facebook': '20',
        'Instagram': '30',
        'TikTok': '40',
        'Referred by another customer': '50',
        'Visited the office': '60',
        'Sales team': '70',
        'Influencer / Blogger': '80',
        'Other': '90',
      };
      const val = hdyhauMap[data.howDidYouHearAboutUs] || '10';
      await this.howDidYouHearDropdown.selectOption(val).catch(() =>
        this.howDidYouHearDropdown.selectOption({ label: data.howDidYouHearAboutUs })
      ).catch(() => {});
    }

    if (data.aboutBusiness !== undefined && await this.aboutBusinessTextarea.isVisible().catch(() => false)) {
      await this.aboutBusinessTextarea.fill(data.aboutBusiness);
    }

    if (data.dateOfBirth !== undefined) {
      try {
        if (await this.dateOfBirthInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await this.dateOfBirthInput.fill(data.dateOfBirth);
        }
      } catch {
        // Optional field — catch gracefully
      }
    }
  }

  async fillStep3(data: Partial<B2BRegistrationData>): Promise<void> {
    await this.acceptTermsCheckbox.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    if (data.acceptTermsOfService && await this.acceptTermsCheckbox.isVisible().catch(() => false)) {
      await this.acceptTermsCheckbox.check();
    }
    if (data.acceptPrivacyPolicy && await this.acceptPrivacyCheckbox.isVisible().catch(() => false)) {
      await this.acceptPrivacyCheckbox.check();
    }
    if (data.ageConfirmed && await this.ageConfirmedCheckbox.isVisible().catch(() => false)) {
      await this.ageConfirmedCheckbox.check();
    }
    if (data.acceptMarketing && await this.acceptMarketingCheckbox.isVisible().catch(() => false)) {
      await this.acceptMarketingCheckbox.check();
    }
  }

  async registerB2BUser(data: B2BRegistrationData): Promise<void> {
    await this.fillStep1(data);
    await this.goToNextStep();

    await this.fillStep2(data);
    await this.goToNextStep();

    await this.fillStep3(data);
    await this.submit();
  }

  // Aliases for spec methods
  async fillCompleteB2BRegistrationForm(data: B2BRegistrationData): Promise<void> {
    await this.fillStep1(data);
    await this.goToNextStep();
    await this.fillStep2(data);
    await this.goToNextStep();
    await this.fillStep3(data);
  }

  async submitRegistration(): Promise<void> {
    await this.submit();
  }

  async assertRegistrationSuccess(): Promise<void> {
    await this.assertRegistrationSubmitted();
  }

  async attemptDuplicateRegistration(email: string): Promise<void> {
    const dummyData = generateDynamicB2BRegistrationData({ email });
    await this.fillStep1(dummyData);
    await this.goToNextStep();
  }

  async assertDuplicateEmailError(): Promise<void> {
    await this.assertValidationError();
  }

  async submit(): Promise<void> {
    await this.dismissModals();

    let transitions = 0;
    while (transitions < 2 && await this.nextStepButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      const advanced = await this.goToNextStep();
      transitions++;
      if (!advanced) break;
    }

    const subBtn = this.submitButton;
    if (await subBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await subBtn.click();
      await this.waitForPageReady();
    }
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  async assertFormDisplayed(): Promise<void> {
    await expect(this.companyNameInput).toBeVisible();
    await expect(this.businessTypeDropdown).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
  }

  async assertRegistrationSubmitted(): Promise<void> {
    await expect(this.page).toHaveURL(/\/register\/result|\/register-result|\/register/, { timeout: 15000 });
    const hasResultText = await this.page.locator('body').textContent().then(t => 
      t ? /under review|application submitted|successfully|your registration/i.test(t) : false
    ).catch(() => false);
    expect(hasResultText || this.page.url().includes('result')).toBeTruthy();
  }

  async assertValidationError(expectedMessage?: string): Promise<void> {
    const isSummaryVisible = await this.validationSummary.isVisible({ timeout: 3000 }).catch(() => false);
    const fieldErrors = await this.fieldValidationErrors.filter({ hasText: /\S/ }).count().catch(() => 0);

    expect(isSummaryVisible || fieldErrors > 0).toBeTruthy();

    if (expectedMessage) {
      const summaryText = await this.validationSummary.textContent().catch(() => '') || '';
      const fieldTexts = (await this.fieldValidationErrors.allTextContents().catch(() => []))?.join(' ') || '';
      const fullErrorText = `${summaryText} ${fieldTexts}`.toLowerCase();
      expect(fullErrorText).toContain(expectedMessage.toLowerCase());
    }
  }
}
