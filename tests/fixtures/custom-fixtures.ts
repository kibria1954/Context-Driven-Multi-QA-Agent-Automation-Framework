/**
 * Custom Playwright Test Fixtures
 *
 * Extends the base Playwright test with pre-configured page objects
 * so specs can simply destructure { loginPage, registerPage } etc.
 *
 * Usage in specs:
 *   import { test, expect } from '../../fixtures/custom-fixtures';
 *   test('my test', async ({ registerPage, adminCustomerDetailsPage }) => { ... });
 */
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { HomePage } from '../../pages/home.page';
import { RegisterPage } from '../../pages/register.page';
import { AdminLoginPage } from '../../pages/admin/admin-login.page';
import { AdminDashboardPage } from '../../pages/admin/admin-dashboard.page';
import { AdminCustomerDetailsPage } from '../../pages/admin/admin-customer-details.page';
import { WishlistPage } from '../../pages/wishlist.page';
import { CheckoutPage } from '../../pages/checkout.page';

/**
 * Type definition for custom fixtures.
 */
type CustomFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  registerPage: RegisterPage;
  adminLoginPage: AdminLoginPage;
  adminDashboardPage: AdminDashboardPage;
  adminCustomerDetailsPage: AdminCustomerDetailsPage;
  wishlistPage: WishlistPage;
  checkoutPage: CheckoutPage;
};

/**
 * Extended test with page object fixtures.
 */
export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  adminLoginPage: async ({ page }, use) => {
    await use(new AdminLoginPage(page));
  },

  adminDashboardPage: async ({ page }, use) => {
    await use(new AdminDashboardPage(page));
  },

  adminCustomerDetailsPage: async ({ page }, use) => {
    await use(new AdminCustomerDetailsPage(page));
  },

  wishlistPage: async ({ page }, use) => {
    await use(new WishlistPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect };

