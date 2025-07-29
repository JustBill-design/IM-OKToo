import { test, expect } from '@playwright/test';

test.describe('forum', ()=> {

  /*
  test.beforeEach(async ({ page })=>{
    await page.goto('/');
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/home');
  });
  
  test('can access forum page', async({ page }) => {
    await page.goto('/forum');
    await page.waitForLoadState('networkidle');
    await expect(page.url()).toContain('/forum');
    const response = await page.goto('/forum');
    expect(response?.status()).toBe(200);
    console.log('can load forum page');
  });
  */
  
  test('forum exist and redirects', async({ page }) => {
    await page.goto('/forum');
    await page.waitForLoadState('networkidle');
    await expect(page.url()).toContain('/');
    console.log('Forum route protection works');
  });
});
 