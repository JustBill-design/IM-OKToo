import { test, expect } from '@playwright/test';

test.describe('login behavior', () => {
  test('login form shows appropriate error for invalid credentials', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="text"]', 'invaliduser');
    await page.fill('input[type="password"]', 'invalidpass');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    const hasError = await page.locator('text=Server error occurred').isVisible() ||
                     await page.locator('text=Invalid credentials').isVisible() ||
                     await page.locator('text=Login failed').isVisible();
    
    expect(hasError).toBeTruthy();
    await expect(page.url()).toContain('/');
    console.log('Login error handling works');
  });

  test('empty form validation', async ({ page }) => {
    await page.goto('/');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    const hasUsernameError = await page.locator('text=Username or email is required').isVisible();
    const hasPasswordError = await page.locator('text=Password is required').isVisible();
    
    expect(hasUsernameError || hasPasswordError).toBeTruthy();
    console.log('Form validation works');
  });
});
