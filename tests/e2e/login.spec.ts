import { test, expect } from '@playwright/test';

test.describe('login flow', ()=>{
  test('page loads and shows login form', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    console.log('login can load');
  });

  test('can fill login form', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="password"]', 'password123');
    await expect(page.locator('input[type="text"]')).toHaveValue('testuser');
    await expect(page.locator('input[type="password"]')).toHaveValue('password123');
    console.log('can fill login form');
  });
});
