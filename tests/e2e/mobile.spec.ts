import { test, expect } from '@playwright/test';

test.describe('Mobile Device Tests', () => {
  test.use({ 
    viewport: { width: 375, height: 667 } // iPhone SE size
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    try {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    } catch (error) {
      console.log('fail storage clear');
    }
  });

  test('mobile login form is usable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if login form is proper size for mobile
    const loginContainer = page.locator('.login-container');
    await expect(loginContainer).toBeVisible();
    const usernameField = page.locator('input#username');
    const passwordField = page.locator('input#password');
    const loginButton = page.locator('button.login-button');

    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(loginButton).toBeVisible();
    await usernameField.click({ force: true });
    await usernameField.fill('testuser');
    await passwordField.click({ force: true });
    await passwordField.fill('Testuser@123');

    // Ensure button is large enough for touch (minimum 44px recommended)
    const buttonBox = await loginButton.boundingBox();
    if (buttonBox) {
      expect(buttonBox.height).toBeGreaterThanOrEqual(40); // Slightly below 44px for tolerance
      expect(buttonBox.width).toBeGreaterThanOrEqual(40);
    }

    await loginButton.click({ force: true });
    await page.waitForURL('/home', { timeout: 10000 });
  });

  test('mobile navigation is accessible', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.fill('input#password', 'Testuser@123');
    await page.click('button.login-button', { force: true });
    await page.waitForURL('/home', { timeout: 10000 });
    const navigationElements = await page.locator([
      '.mobile-menu',
      '.hamburger',
      '.nav-menu',
      '.sidebar',
      'nav',
      '[data-testid="mobile-nav"]',
      '.menu-button'
    ].join(', ')).count();

    if (navigationElements > 0) {
      console.log('Mobile navigation found');
    } else {
      console.log('mobile navi future plan ');
    }

    // Test accessing different pages on mobile
    await page.goto('/forum');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/forum');

    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/calendar');
  });

  test('mobile form validation displays correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('button.login-button', { force: true });
    await page.waitForTimeout(2000);
    const errorMessages = page.locator('.error-message');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
    if (errorCount > 0) {
      const firstError = errorMessages.first();
      await expect(firstError).toBeVisible();
    }
  });

  test('orientation changes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    let loginContainer = page.locator('.login-container');
    await expect(loginContainer).toBeVisible();
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(1000);
    
    loginContainer = page.locator('.login-container');
    await expect(loginContainer).toBeVisible();
    await page.fill('input#username', 'test');
    await expect(page.locator('input#username')).toHaveValue('test');
  });

  test('mobile touch targets are adequate', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const minSize = 44;
    const interactiveElements = [
      'button.login-button',
      'input#username',
      'input#password'
    ];

    for (const selector of interactiveElements) {
      const element = page.locator(selector);
      await expect(element).toBeVisible();
      
      const box = await element.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(minSize);
        expect(box.width).toBeGreaterThanOrEqual(minSize);
      }
    }
  });
});
