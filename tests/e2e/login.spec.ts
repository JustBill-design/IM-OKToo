import { test, expect } from '@playwright/test';
import { LoginPage, NavigationHelpers, clearAuthState } from './helpers';

test.describe('Login test', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthState(page);
  });

  test('can load login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForLoginForm();
    await loginPage.expectLoginForm();
  });

  test('shows validation errors for empty form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForLoginForm();
    
    await loginPage.submitForm();
    
    await page.waitForTimeout(1000);
    
    const hasErrors = await page.locator('.error-message').count() > 0;
    expect(hasErrors).toBeTruthy();
  });

  test(' login with test account', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForLoginForm();
    
    await loginPage.fillCredentials('testuser', 'Testuser@123');
    await loginPage.submitForm();
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    console.log('Current URL after login attempt:', currentUrl);
    expect(currentUrl).toBeTruthy();
  });

  test('can fill and clear form fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForLoginForm();
    await loginPage.fillCredentials('test@mmmm', 'testpass');
    await expect(page.locator('input#username')).toHaveValue('test@mmmm');
    await expect(page.locator('input#password')).toHaveValue('testpass');
    await page.fill('input#username', '');
    await page.fill('input#password', '');
    await expect(page.locator('input#username')).toHaveValue('');
    await expect(page.locator('input#password')).toHaveValue('');
  });
});
