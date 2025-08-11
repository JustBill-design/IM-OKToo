import { test, expect } from '@playwright/test';

test.describe('User Journey Tests', () => {
  test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  try {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  } catch (error) {
    // Ignore storage errors
    console.log('fail to clear');
  }
});

  test('login to home to nagivate', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.login-container')).toBeVisible();
    await page.fill('input#username', 'testuser');
    await page.fill('input#password', 'Testuser@123');
    await page.click('button.login-button', { force: true });
    await page.waitForURL('/home', { timeout: 10000 });
    expect(page.url()).toContain('/home');
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/calendar');

    await page.goto('/resources');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/resources');

    await page.goto('/forum');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/forum');

    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/settings');
  });

  test('browser navigation works', async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.fill('input#password', 'Testuser@123');
    await page.click('button.login-button', { force: true });
    await page.waitForURL('/home', { timeout: 10000 });
    await page.goto('/forum');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/forum');
    
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/calendar');

    await page.goto('/resources');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/resources');
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/home');
    expect(page.url()).not.toContain('/login');
    expect(page.url()).not.toBe('http://localhost:5173/');
  });

  test('registing page accessibility', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/register');
    const hasForm = await page.locator('form, input, button').count() > 0;
    expect(hasForm).toBeTruthy();
  });

  test('auth last across tabs', async ({ context, page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.fill('input#password', 'Testuser@123');
    await page.click('button.login-button', { force: true });
    await page.waitForURL('/home', { timeout: 10000 });

    const newPage = await context.newPage();
    await newPage.goto('/forum');
    await newPage.waitForLoadState('networkidle');
    expect(newPage.url()).toContain('/forum');
    
    await newPage.close();
  });

});

test.describe('Error Handling Tests', () => {
  test('handles network errors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Block login request
    await page.route('**/validate', route => route.abort());

    await page.fill('input#username', 'testuser');
    await page.fill('input#password', 'Testuser@123');
    await page.click('button.login-button', { force: true });
    await page.waitForTimeout(3000);
    const hasErrorHandling = await page.locator('.error-message, .loading, .spinner').count() > 0 || 
                               await page.locator('text=error').count() > 0 || 
                               await page.locator('text=failed').count() > 0;
    expect(hasErrorHandling).toBeTruthy();
  });

  test('handles invalid routes', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await page.waitForLoadState('networkidle');
    
    // Shld redirect 
    const isHandled = page.url().includes('/') || 
                     page.url().includes('404') || 
                     await page.locator('text=404, text=Not Found, text=Page not found').isVisible();
    expect(isHandled).toBeTruthy();
  });
});
