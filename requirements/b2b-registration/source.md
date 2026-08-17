As a new wholesale buyer
I want to register for a B2B wholesale account on the Korean Demands BD website
So that I can access wholesale pricing, place bulk orders, and manage my business account
Acceptance Criteria
Scenario: Successful B2B Registration Form Submission & Entity Creation
Given the user is on the public store and navigates to the registration page When the user fills in all required fields including:

Company Info: Company Name, Type of Business (dropdown), Email, Phone Number, Website URL, Address Line 1 & 2, City, State, Zip Code
Contact Details: Contact Name, Position, Contact Media (WhatsApp or Messenger) along with the respective conditional fields (WhatsApp Number or Messenger Account Name & Link)
Account Setup: Username, Password, Confirm Password, "How did you hear about us?" (dropdown), "Tell us about your business"
Agreements: Wholesale Account Agreement(Texts), Terms of Service, Privacy Policy, and 18+ Age confirmation And clicks "Create Account" Then the system should automatically create a new ERP Account using the Company Name And create a Ship-To Address (Branch) using the physical address provided in the form And create a new B2B customer account in an "inactive" state And immediately map the new inactive customer account to the newly created ERP account And the user should be redirected to a success page notifying them that their application is under review.

Scenario: Uniqueness Validation During Registration Given the user is filling out the B2B registration form When the user enters an Email address or Username that is already registered in the system And clicks "Create Account" Then the system should block the submission And display a clear validation error message indicating that the Email or Username is already in use.

Scenario: Admin Reviews Wholesale Application Details Given a wholesale buyer has submitted a registration application When an administrator views that customer's profile in the admin portal Then the administrator should see a dedicated "KD Registration Details" section And be able to review all the custom wholesale application data (Type of Business, Contact Media, Position, Age Confirmation, etc.) submitted by the user.

Scenario: Admin Approves and Activates B2B Account Given a new wholesale user has a pending, inactive account (which is already mapped to their ERP account) When the administrator reviews the application and checks the "Active" flag to approve the account And saves the changes Then the customer account should become fully active allowing the user to log in and use their pre-mapped B2B features And the system should automatically send a welcome/activation email to the customer.

Note: For admin approval please login as admin than goto admin site(nopCommerce). Than navigate to customer from side bar, than filter is active> Select All to find new registered user as unactive..... Please user faker data for dynamic input... in phone field of registration please select bd number(11 digit)
