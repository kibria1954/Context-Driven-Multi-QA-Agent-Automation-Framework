/**
 * Centralized Selector Registry for KBD NopCommerce Site
 *
 * Since the site does NOT use data-testid attributes, selectors are organized
 * by page/component with human-readable descriptions for error messages.
 *
 * Priority order: #id > accessible role/label > .unique-class > CSS combinators > XPath (last resort)
 *
 * Each selector entry includes:
 *   - selector: the CSS/role selector string
 *   - description: human-readable name for logs, reports, and error messages
 *
 * IMPORTANT: This file is the SINGLE SOURCE OF TRUTH for all selectors.
 * Never use inline selectors in page objects or test specs.
 * Stage 7 (Loop B) self-healing updates selectors HERE, not in test files.
 */

// ─── Selector Entry Type ─────────────────────────────────────────────────────

export interface SelectorFallback {
  /** Stability tier from Agent 3's live-exploration capture — see .agents/skills/04-live-explorer/SKILL.md */
  readonly tier: 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7';
  readonly selector: string;
}

export interface SelectorEntry {
  readonly selector: string;
  readonly description: string;
  /**
   * Optional ranked fallback candidates captured during live exploration (Stage 4) or
   * added by self-healing (Stage 5, Loop B). Absent until a page has actually been
   * explored/healed — `selector` alone remains valid and functional either way.
   * Loop B patches a heal by appending here first; it only promotes a fallback to be
   * the primary `selector` after semantic verification passes (see 06-execution-self-heal).
   */
  readonly fallbacks?: readonly SelectorFallback[];
  /**
   * ISO timestamp when this selector was last verified against the live site by
   * Stage 4 (Live Explorer). Used by Stage 7 to flag drift candidates.
   * P0 selectors: re-verify weekly. P1: monthly. P2: quarterly.
   * IMP-003: Added 2026-08-21.
   */
  readonly verifiedAt?: string;
  /**
   * Run identifier (e.g. "b2b-registration-run-3") from the Stage 4 session that
   * verified this selector. Cross-references with memory/run-history/.
   */
  readonly verifiedInRun?: string;
}

// ─── Helper: Extract selector string ─────────────────────────────────────────

/**
 * Extract the CSS selector string from a SelectorEntry.
 * Use this in page objects: `this.page.locator(sel(LOGIN_SELECTORS.emailInput))`
 */
export function sel(entry: SelectorEntry): string {
  return entry.selector;
}

// ─────────────────────────────────────────────
// HEADER / GLOBAL NAVIGATION
// ─────────────────────────────────────────────

export const HEADER_SELECTORS = {
  // Search
  searchInput: {
    selector: '#small-searchterms',
    description: 'Header search input',
  },
  searchButton: {
    selector: 'button.search-box-button',
    description: 'Header search button',
  },

  // Cart
  cartLink: {
    selector: 'a.header-link-cart, a[href="/cart"]',
    description: 'Shopping cart link',
  },
  cartQuantity: {
    selector: '.cart-qty',
    description: 'Cart item count badge',
  },

  // Wishlist
  wishlistLink: {
    selector: 'a.ico-wishlist.header-link-wishlist, a[href="/korean-wishlist"], a[href="/wishlist"]',
    description: 'Wishlist link in header navbar',
  },

  // Logged-out state
  loginLink: {
    selector: 'a.header-link-login, a[href="/login"]',
    description: 'Header login link',
  },
  registerLink: {
    selector: 'a.header-link-register, a[href="/register"]',
    description: 'Header register link',
  },

  // Logged-in state
  accountTrigger: {
    selector: '.header-links .account, a.header-link-account',
    description: 'Account dropdown trigger (username)',
  },
  myAccountLink: {
    selector: 'a[href="/customer/info"]',
    description: 'My Account link in dropdown',
  },
  logoutLink: {
    selector: 'a.header-link-logout, a[href="/logout"]',
    description: 'Logout link',
  },
} as const;

// ─────────────────────────────────────────────
// NAVIGATION MENU
// ─────────────────────────────────────────────

export const NAV_SELECTORS = {
  mainMenu: {
    selector: '.header-menu',
    description: 'Main navigation menu',
  },
  categoriesMenu: {
    selector: '.header-menu .sublist-toggle',
    description: 'K-Beauty Categories dropdown trigger',
  },
  brandLink: {
    selector: "a[href='/manufacturer/all']",
    description: 'Brands navigation link',
  },
  promotionLink: {
    selector: "a[href='/promotions']",
    description: 'Promotions navigation link',
  },
  boxDamageLink: {
    selector: "a[href='/box-damage']",
    description: 'Box Damage navigation link',
  },
  restockRequestLink: {
    selector: "a[href='/restock-request']",
    description: 'Restock Request navigation link',
  },
} as const;

// ─────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────

export const LOGIN_SELECTORS = {
  // Form fields
  emailInput: {
    selector: '#Email',
    description: 'Login email input',
  },
  passwordInput: {
    selector: '#Password',
    description: 'Login password input',
  },
  rememberMeCheckbox: {
    selector: '#RememberMe',
    description: 'Remember me checkbox',
  },
  loginButton: {
    selector: 'button.login-button, form.login-form button[type="submit"], button.login-button:visible',
    description: 'Login submit button',
  },
  forgotPasswordLink: {
    selector: "a[href='/passwordrecovery']",
    description: 'Forgot password link',
  },
  registerLink: {
    selector: 'a.register-here',
    description: 'Register here link on login page',
  },

  // Validation & Errors
  validationSummary: {
    selector: '.message-error.validation-summary-errors',
    description: 'Login form error summary',
  },
  emailValidationError: {
    selector: 'span[data-valmsg-for="Email"]',
    description: 'Email field validation error',
  },
  passwordValidationError: {
    selector: 'span[data-valmsg-for="Password"]',
    description: 'Password field validation error',
  },

  // Page structure
  pageTitle: {
    selector: '.page-title h1',
    description: 'Login page heading',
  },
  loginForm: {
    selector: 'form.login-form, form[action*="login"]',
    description: 'Login form container',
  },
} as const;

// ─────────────────────────────────────────────
// REGISTRATION PAGE (B2B Wholesale & Retail)
// ─────────────────────────────────────────────

export const REGISTER_SELECTORS = {
  // ── Step 1: Company Info ──
  companyName: {
    selector: '#CompanyName',
    description: 'Company name input',
  },
  businessType: {
    selector: '#TypeOfBusinessId',
    description: 'Type of business dropdown',
  },
  email: {
    selector: '#Email',
    description: 'Registration email input',
  },
  phone: {
    selector: '#PhoneNumber',
    description: 'Phone number input (11-digit BD)',
  },
  websiteUrl: {
    selector: '#WebsiteUrl',
    description: 'Website or Facebook page URL input',
  },

  // Address Info
  addressLine1: {
    selector: '#AddressLine1',
    description: 'Address line 1 input',
  },
  addressLine2: {
    selector: '#AddressLine2',
    description: 'Address line 2 input',
  },
  city: {
    selector: '#City',
    description: 'City input',
  },
  stateDivision: {
    selector: '#County',
    description: 'State / Division input',
  },
  zipCode: {
    selector: '#ZipPostalCode',
    description: 'ZIP / Postal code input',
  },

  // Contact Details
  contactName: {
    selector: '#ContactName',
    description: 'Contact name input',
  },
  position: {
    selector: '#Position',
    description: 'Position input',
  },
  contactMedia: {
    selector: '#ContactMediaId',
    description: 'Preferred contact channel dropdown',
  },

  // Conditional Contact Fields
  whatsAppNumber: {
    selector: '#WhatsAppNumber',
    description: 'WhatsApp number input',
  },
  messengerAccountName: {
    selector: '#MessengerAccountName',
    description: 'Messenger account name input',
  },
  messengerAccountLink: {
    selector: '#MessengerAccountLink',
    description: 'Messenger profile link input',
  },

  // ── Step 2: Account Setup ──
  username: {
    selector: '#Username',
    description: 'Username input',
  },
  password: {
    selector: '#Password',
    description: 'Password input',
  },
  confirmPassword: {
    selector: '#ConfirmPassword',
    description: 'Confirm password input',
  },
  howDidYouHearAboutUs: {
    selector: '#HowDidYouHearAboutUsId',
    description: 'How did you hear about us dropdown',
  },
  aboutBusiness: {
    selector: '#AboutBusiness',
    description: 'Tell us about your business textarea',
  },

  // ── Step 3: Agreements & Submit ──
  nextStepButton: {
    selector: 'button.register-next-step-button, button.kd-next-btn, button:has-text("Next")',
    description: 'Next step button on wizard',
    fallbacks: [
      { tier: 'T4', selector: 'button.kd-next-btn' },
      { tier: 'T6', selector: "button:has-text('Next')" },
    ],
  },
  previousStepButton: {
    selector: 'button.kd-prev-btn, button:has-text("Previous")',
    description: 'Previous step button on wizard',
  },
  acceptTermsOfService: {
    selector: '#AcceptTermsOfService',
    description: 'Terms of Service agreement checkbox',
  },
  acceptPrivacyPolicy: {
    selector: '#AcceptPrivacyPolicy',
    description: 'Privacy Policy agreement checkbox',
  },
  ageConfirmed: {
    selector: '#AgeConfirmed',
    description: '18+ Age confirmation checkbox',
  },
  submitButton: {
    selector: '#kd-register-submit',
    description: 'Submit Application button',
  },

  // Wizard Step Indicators
  wizardStepActive: {
    selector: '.kd-step.active, .wizard-step.active',
    description: 'Currently active wizard step indicator',
  },
  wizardStep1: {
    selector: '.kd-step:nth-child(1), [data-step="1"]',
    description: 'Wizard step 1 indicator',
  },
  wizardStep2: {
    selector: '.kd-step:nth-child(2), [data-step="2"]',
    description: 'Wizard step 2 indicator',
  },
  wizardStep3: {
    selector: '.kd-step:nth-child(3), [data-step="3"]',
    description: 'Wizard step 3 indicator',
  },

  // Validation & Success
  fieldValidationError: {
    selector: '.field-validation-error',
    description: 'Field-level validation error span',
  },
  validationSummary: {
    selector: '.validation-summary-errors',
    description: 'Registration form validation summary error list',
  },
  resultMessage: {
    selector: '.result, .register-result-page',
    description: 'Registration success/result page content container',
  },
  pageTitle: {
    selector: '.page-title h1',
    description: 'Registration page heading',
  },
} as const;

// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────

export const HOME_SELECTORS = {
  heroSlider: {
    selector: '.nivo-main-image, .slider-wrapper, .home-page-slider',
    description: 'Homepage hero slider/banner',
  },
  featuredProducts: {
    selector: '.product-grid, .item-grid',
    description: 'Featured products grid',
  },
  productCard: {
    selector: '.product-item',
    description: 'Individual product card',
  },
  productTitle: {
    selector: '.product-item .product-title a',
    description: 'Product card title link',
  },
  productPrice: {
    selector: '.product-item .actual-price',
    description: 'Product card price',
  },
  addToCartButton: {
    selector: '.product-item .product-box-add-to-cart-button',
    description: 'Add to cart button on product card',
  },
  categorySection: {
    selector: '.home-page-category-grid',
    description: 'Homepage category grid section',
  },
} as const;

// ─────────────────────────────────────────────
// PRODUCT DETAIL PAGE
// ─────────────────────────────────────────────

export const PRODUCT_SELECTORS = {
  productName: {
    selector: '.product-name h1',
    description: 'Product detail page title',
  },
  productPrice: {
    selector: '.product-price span',
    description: 'Product detail price',
  },
  addToCartButton: {
    selector: '#add-to-cart-button, button.add-to-cart-button',
    description: 'Add to cart button on product detail',
  },
  quantityInput: {
    selector: '.qty-input input, #product_enteredQuantity',
    description: 'Product quantity input',
  },
  productImages: {
    selector: '.gallery .picture img',
    description: 'Product image gallery',
  },
  productDescription: {
    selector: '.full-description',
    description: 'Product full description',
  },
  productTabs: {
    selector: '.product-details-tabs',
    description: 'Product detail tabs (description, reviews etc.)',
  },
} as const;

// ─────────────────────────────────────────────
// CART PAGE
// ─────────────────────────────────────────────

export const CART_SELECTORS = {
  cartTable: {
    selector: '.cart-table, .table-wrapper',
    description: 'Shopping cart items table',
  },
  cartItem: {
    selector: '.cart-item, .cart-item-row',
    description: 'Individual cart item row',
  },
  removeCheckbox: {
    selector: 'input[name="removefromcart"]',
    description: 'Remove from cart checkbox',
  },
  updateCartButton: {
    selector: 'button[name="updatecart"]',
    description: 'Update shopping cart button',
  },
  checkoutButton: {
    selector: '#checkout, button.checkout-button',
    description: 'Proceed to checkout button',
  },
  emptyCartMessage: {
    selector: '.no-data, .order-summary-content',
    description: 'Empty cart message',
  },
  cartTotal: {
    selector: '.cart-total .order-total strong',
    description: 'Cart total amount',
  },
} as const;

// ─────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────

export const ADMIN_SELECTORS = {
  // Login (admin uses same form as storefront when redirected)
  emailInput: {
    selector: '#Email',
    description: 'Admin login email input',
  },
  passwordInput: {
    selector: '#Password',
    description: 'Admin login password input',
  },
  loginButton: {
    selector: 'button.login-button, form.login-form button[type="submit"], button.login-button:visible',
    description: 'Admin login button',
  },

  // Dashboard
  dashboardHeader: {
    selector: '.content-header h1',
    description: 'Admin dashboard header',
  },
  sidebarMenu: {
    selector: '.sidebar-menu, #nopSideBarPusher',
    description: 'Admin sidebar navigation',
  },
  sidebarMenuItem: {
    selector: '.sidebar-menu .nav-item',
    description: 'Sidebar menu item',
  },

  // Common admin elements
  saveButton: {
    selector: 'button[name="save"]',
    description: 'Admin save button',
  },
  searchButton: {
    selector: '#search-products, button.btn-search',
    description: 'Admin search/filter button',
  },
  dataTable: {
    selector: '#products-grid, .dataTables_wrapper',
    description: 'Admin data grid table',
  },
  alertSuccess: {
    selector: '.alert-success',
    description: 'Admin success alert',
  },
  alertDanger: {
    selector: '.alert-danger',
    description: 'Admin error alert',
  },

  // Customer management
  customerListSearch: {
    selector: '#SearchEmail',
    description: 'Admin customer search by email',
  },
  customerSearchButton: {
    selector: '#search-customers',
    description: 'Admin customer search button',
  },
  customerGrid: {
    selector: '#customers-grid',
    description: 'Admin customer data grid',
  },
} as const;

// ─────────────────────────────────────────────
// ADMIN — ADVANCED B2B/B2C > REGISTRATION APPLICATIONS
// (Confirmed real location for REQ-07's "KD Registration Details" —
//  see workflows/b2b-registration.verify.json's discrepancy note)
// ─────────────────────────────────────────────

export const ERP_REGISTRATION_SELECTORS = {
  // Admin → Advanced B2B/B2C → ERP Accounts (/Admin/ErpAccount/List) — the grid that
  // actually receives a row per submitted wholesale registration. The previously-used
  // /Admin/ErpRegistrationApplication/List ("Registration Applications") page never
  // populates from self-registration — confirmed live, always shows "No records" there.
  applicationsGrid: {
    selector: 'table tbody tr',
    description: 'ERP Accounts data grid rows',
    fallbacks: [
      { tier: 'T5', selector: '.dataTables_wrapper table tbody tr' },
    ],
  },
  gridSearchInput: {
    selector: '#AccountName',
    description: 'ERP Accounts grid "Account Name" search/filter input',
  },
  gridSearchButton: {
    selector: '#search-erpAccounts',
    description: 'ERP Accounts grid Search button',
  },
} as const;

// ─────────────────────────────────────────────
// COMMON / SHARED SELECTORS
// ─────────────────────────────────────────────

export const COMMON_SELECTORS = {
  // Modals / Popups
  welcomeModal: {
    selector: '.modal.show, .popup-modal, .newsletter-popup, #kdn-welcome-modal',
    description: 'Welcome/Newsletter popup modal',
  },
  modalCloseButton: {
    selector: '.modal .close, .modal-close, .popup-close, .kdn-close',
    description: 'Modal close button',
  },
  modalBackdrop: {
    selector: '.modal-backdrop, .kdn-welcome-modal-overlay',
    description: 'Modal backdrop overlay',
  },
  cookieConsent: {
    selector: '.cookie-consent, .eu-cookie-bar',
    description: 'Cookie consent bar',
  },
  cookieAcceptButton: {
    selector: '.cookie-consent button, .eu-cookie-bar-notification button',
    description: 'Cookie consent accept button',
  },

  // Notifications
  barNotification: {
    selector: '#bar-notification',
    description: 'Bar notification (success/error)',
  },
  barNotificationSuccess: {
    selector: '#bar-notification .content.success',
    description: 'Success bar notification',
  },
  barNotificationError: {
    selector: '#bar-notification .content.error',
    description: 'Error bar notification',
  },
  barNotificationClose: {
    selector: '#bar-notification .close',
    description: 'Close bar notification',
  },

  // Loading
  ajaxLoader: {
    selector: '.ajax-loading-block-window, .ajax-loader',
    description: 'AJAX loading indicator',
  },

  // Page structure
  pageTitle: {
    selector: '.page-title h1',
    description: 'Page title heading',
  },
  breadcrumb: {
    selector: '.breadcrumb',
    description: 'Breadcrumb navigation',
  },
  footer: {
    selector: '.footer',
    description: 'Page footer',
  },

  // Pagination
  pagination: {
    selector: '.pager',
    description: 'Pagination controls',
  },
  nextPage: {
    selector: '.pager .next-page',
    description: 'Next page button',
  },
  previousPage: {
    selector: '.pager .previous-page',
    description: 'Previous page button',
  },
} as const;

// ─────────────────────────────────────────────
// WISHLIST SELECTORS
// ─────────────────────────────────────────────

export const WISHLIST_SELECTORS = {
  wishlistHeaderLink: {
    selector: 'a.ico-wishlist.header-link-wishlist, a[href*="wishlist"]',
    description: 'Header wishlist link with count badge',
  },
  myAccountWishlistSidebarLink: {
    selector: 'a:has-text("Wish List"), a[href*="wishlist"]',
    description: 'My Account sidebar Wish List link',
  },
  productLink: {
    selector: '.product-title a, .product-item a, .product-box-title a',
    description: 'Product grid item title/image link',
  },
  productCardWishlistButton: {
    selector: 'button.add-to-wishlist-button.gallery-wishlist-btn, button.add-to-wishlist-button, button.product-card-wishlist',
    description: 'Wishlist button on product card or PDP',
  },
  pdpWishlistButton: {
    selector: 'button.add-to-wishlist-button.gallery-wishlist-btn, button[id*="add-to-wishlist-button"]',
    description: 'Wishlist button on product detail page',
  },
  wishlistItemCard: {
    selector: '.wishlist-content .product-item, .wishlist-content table.wishlist, .wishlist-content .product-grid',
    description: 'Wishlist product item card container',
  },
  removeItemButton: {
    selector: 'button.remove-btn.wishlist-remove-btn, button.remove-btn, input[name="removefromcart"]',
    description: 'Remove item from wishlist button',
  },
  addToCartFromWishlistButton: {
    selector: 'button.wishlist-add-to-cart-btn',
    description: 'Add to cart from wishlist button',
  },
  emptyWishlistMessage: {
    selector: '.no-data, .wishlist-content:has-text("empty")',
    description: 'Empty wishlist state message container',
  },
  browseProductsButton: {
    selector: 'a.button-1.browse-products-button, a.browse-products-button',
    description: 'Browse products button linking to home page',
  },
  notificationBar: {
    selector: '#bar-notification.success, #bar-notification',
    description: 'Success bar notification container',
  },
} as const;

export const CHECKOUT_SELECTORS = {
  cartUrl: {
    selector: '/cart',
    description: 'Shopping cart URL',
  },
  welcomeModalClose: {
    selector: 'button.kdn-welcome-modal__close',
    description: 'Welcome popup modal close button',
  },
  termsOfService: {
    selector: '#termsofservice',
    description: 'Terms of service checkbox',
  },
  termsOfServiceDialog: {
    selector: '#terms-of-service-warning-box, .ui-dialog',
    description: 'Terms of service warning modal dialog',
  },
  checkoutButton: {
    selector: 'button#checkout, button.checkout-button',
    description: 'Proceed to Checkout button',
  },
  minOrderWarning: {
    selector: '.min-order-warning, .warning, .message-error, .order-summary-content',
    description: 'Minimum order amount warning message',
  },
  cartQtyInput: {
    selector: 'input.b2bProductQty, input.qty-input',
    description: 'Cart item quantity input field',
  },
  confirmOrderButton: {
    selector: 'button.confirm-order-next-step-button, button:has-text("Confirm")',
    description: 'Order confirmation submit button',
  },
  orderCompletedTitle: {
    selector: '.section.order-completed .title, .order-completed, h1:has-text("Thank you")',
    description: 'Order completed success title',
  },
  orderCompletedMessage: {
    selector: '.order-completed, .section.order-completed',
    description: 'Order completed success message body',
  },
  orderDetailsLink: {
    selector: 'a:has-text("Click here for order details."), a[href*="orderdetails"]',
    description: 'Link to view placed order details',
  },
  orderNumber: {
    selector: '.order-number, .order-details-page .order-number, .order-completed .order-number',
    description: 'Order number text container',
  },
  shippingAddressContainer: {
    selector: '.shipping-info, .address-information, .shipping-address',
    description: 'Shipping address info block',
  },
  orderHistoryLink: {
    selector: 'a[href*="order/history"], a[href*="order-history"], a[href*="orders"]',
    description: 'Order history page link',
  },
  orderHistoryTable: {
    selector: '.order-list, .data-table, table.orders-grid, .section.order-list',
    description: 'Order history table container',
  },
} as const;

// ─── All Selector Groups (for enumeration) ───────────────────────────────────

export const ALL_SELECTOR_GROUPS = {
  HEADER: HEADER_SELECTORS,
  NAV: NAV_SELECTORS,
  LOGIN: LOGIN_SELECTORS,
  REGISTER: REGISTER_SELECTORS,
  HOME: HOME_SELECTORS,
  PRODUCT: PRODUCT_SELECTORS,
  CART: CART_SELECTORS,
  ADMIN: ADMIN_SELECTORS,
  ERP_REGISTRATION: ERP_REGISTRATION_SELECTORS,
  COMMON: COMMON_SELECTORS,
  WISHLIST: WISHLIST_SELECTORS,
  CHECKOUT: CHECKOUT_SELECTORS,
} as const;

