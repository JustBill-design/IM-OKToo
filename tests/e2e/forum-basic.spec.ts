import { test, expect } from '@playwright/test';

test.describe('forum basic access', () => {
  test('forum route redirects without authentication', async ({ page }) => {
    await page.goto('/forum');
    await page.waitForLoadState('networkidle');
    await expect(page.url()).toContain('/');
    await expect(page.locator('h1:has-text("Login")')).toBeVisible();
    console.log('Forum redirects to login correctly');
  });

  test('can access login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Log in")')).toBeVisible();
    
    console.log('Login page structure visible');
  });
});
