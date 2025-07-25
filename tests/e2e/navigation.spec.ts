import { test, expect } from '@playwright/test';

test.describe('go home login', () =>{
  test('homepage loads after login', async({ page })=>{
    await page.goto('/');
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/home', { timeout: 10000 });
    await expect(page.url()).toContain('/home');
    console.log('login and fo home works');
  });
});
