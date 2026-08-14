# Feature Requirement: B2B Wholesale Customer Registration & Admin Approval Workflow

## Overview
As a new wholesale buyer, I want to register for a B2B wholesale account on the Korean Demands BD website so that I can access wholesale pricing, place bulk orders, and manage my business account.

## Acceptance Criteria

### REQ-01: Successful B2B Registration Form Submission & Entity Creation
- **Given** the user is on the public store and navigates to the registration page (`/register`)
- **When** the user fills in all required fields including:
  - **Company Info**:
    - Company Name (required text)
    - Type of Business (required dropdown with values: `Retailer (Online page only)`, `Retailer (Online page + physical shop)`, `Retailer (Physical shop only)`, `Wholesaler (Online page)`, `Wholesaler (Physical shop)`, `Clinic / Pharmacy`, `Salon / Parlour`, `Reseller`)
    - Email (required valid email format)
    - Phone Number (required 11-digit BD mobile number starting with 01)
    - Website / Facebook Page URL (optional text)
    - Address Line 1 (required text)
    - Address Line 2 (optional text)
    - City (required text)
    - State / Division (required text)
    - ZIP Code (optional text)
    - Trade License Attachment (optional file upload: PDF/PNG/JPG, max 5MB)
  - **Contact Details**:
    - Contact Name (required text)
    - Position (required text)
    - Preferred Contact Channel (required dropdown: `Whatsapp`, `Messenger`)
      - If `Whatsapp` is selected: WhatsApp number (required 11-digit BD mobile number starting with 01)
      - If `Messenger` is selected: Messenger account name (required text) & Messenger profile link (required valid URL)
  - **Account Setup**:
    - Username (required text, min 4 characters)
    - Password (required text, min 6 characters)
    - Confirm Password (required text, must match Password)
    - How did you hear about us? (dropdown with values: `Google Search`, `Facebook`, `Instagram`, `TikTok`, `Referred by another customer`, `Visited the office`, `Sales team`, `Influencer / Blogger`, `Other`)
    - Tell us about your business (optional textarea)
    - Date of birth (optional text: mm/dd/yyyy)
  - **Agreements**:
    - Terms of Service Agreement checkbox (required)
    - Privacy Policy Agreement checkbox (required)
    - 18+ Age & Legal Authority Confirmation checkbox (required)
    - Marketing communications checkbox (optional)
- **And** clicks "Create Account"
- **Then**:
  - The system creates a new ERP Account using the Company Name.
  - The system creates a Ship-To Address (Branch) using the physical address provided.
  - The system creates a new B2B customer account in an "inactive" state.
  - The system maps the new inactive customer account to the newly created ERP account.
  - The user is redirected to a success page notifying them that their application is under review (`/register/result`).

### REQ-02: Uniqueness Validation During Registration
- **Given** the user is filling out the B2B registration form
- **When** the user enters an Email address or Username that is already registered in the system
- **And** clicks "Create Account"
- **Then**:
  - The system blocks the submission.
  - The system displays a validation error message indicating that the Email or Username is already in use.

### REQ-03: Admin Reviews Wholesale Application Details
- **Given** a wholesale buyer has submitted a registration application
- **When** an administrator views that customer's profile in the admin portal (`/Admin`)
- **Then**:
  - The administrator sees a dedicated "KD Registration Details" section.
  - The administrator is able to review all custom wholesale application data (Type of Business, Contact Media, Position, Age Confirmation, Trade License) submitted by the user.

### REQ-04: Admin Approves and Activates B2B Account
- **Given** a new wholesale user has a pending, inactive account (which is already mapped to their ERP account)
- **When** the administrator reviews the application, checks the "Active" flag to approve the account, and saves changes
- **Then**:
  - The customer account becomes fully active, allowing the user to log in and use their pre-mapped B2B features.
  - The system sends a welcome/activation email to the customer.

### REQ-05: Password Mismatch & Field Format Validation
- **Given** the user is filling out the B2B registration form
- **When** the user enters a Confirm Password that does not match Password, or inputs an invalid BD Mobile number (not 11 digits or not starting with 01)
- **And** clicks "Create Account"
- **Then**:
  - The system blocks form submission.
  - The system displays clear validation error messages under the respective invalid fields.

### REQ-06: Dynamic Contact Channel Toggle & Field Clear Validation
- **Given** the user is selecting their Preferred Contact Channel
- **When** the user switches between `Whatsapp` and `Messenger`
- **Then**:
  - The form dynamically shows the relevant input fields (WhatsApp number for `Whatsapp`; Messenger Name & Profile Link for `Messenger`).
  - Previously entered values in hidden channel fields are cleared to prevent submission of stale contact data.
