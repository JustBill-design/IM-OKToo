import { test, expect } from '@playwright/test';

test.describe('App smoke test', () => {
  test('application loads and shows login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.login-container')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input#username')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('button.login-button')).toBeVisible();
  });

  test('can interact with login form', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.login-container', { timeout: 10000 });
    await page.fill('input#username', 'testuser');
    await expect(page.locator('input#username')).toHaveValue('testuser');
    await page.fill('input#password', 'testpassword');
    await expect(page.locator('input#password')).toHaveValue('testpassword');
    await page.fill('input#username', '');
    await page.fill('input#password', '');
    
    await expect(page.locator('input#username')).toHaveValue('');
    await expect(page.locator('input#password')).toHaveValue('');
  });

  test('login redirects to home', async ({page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.login-container', {timeout: 10000 });
    
    await page.fill('input#username', 'testuser');
    await page.fill('input#password', 'Testuser@123');
    
    await page.click('button.login-button', {force: true });
    await page.waitForURL('/home', {timeout: 10000 });
    expect(page.url()).toContain('/home');
  });

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.login-container', {timeout: 10000 });
    await page.fill('input#username', 'wronguser');
    await page.fill('input#password', 'wrongpass');
    await page.click('button.login-button', { force: true });
    await page.waitForTimeout(3000);
    const hasErrorMessage = await page.locator('.error-message').isVisible();
    expect(hasErrorMessage).toBeTruthy();
  });

  test('empty form submission', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.login-container', { timeout: 10000 });
    await page.click('button.login-button', { force: true });
    await page.waitForTimeout(2000);
    const errorCount = await page.locator('.error-message').count();
    expect(errorCount).toBeGreaterThan(0);
  });

  test('routes are protected', async ({ page }) => {
    const protectedRoutes = ['/home', '/calendar', '/resources', '/forum', '/settings'];
    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      const isAtLogin = page.url().includes('/') && !page.url().includes(route);
      expect(isAtLogin).toBeTruthy();
      
      await expect(page.locator('.login-container')).toBeVisible();
    }
  });
});
