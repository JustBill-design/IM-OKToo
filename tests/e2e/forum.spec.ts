import { test, expect } from '@playwright/test';

test.describe('Forum access', () => {
  test('forum redirects to login', async ({ page }) => {
    await page.goto('/forum');
    await page.waitForLoadState('networkidle');
    const isAtLogin = page.url().includes('/') && !page.url().includes('/forum');
    expect(isAtLogin).toBeTruthy();
    await expect(page.locator('input#username')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('button.login-button')).toBeVisible();
  });

  test('login page loads correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('input#username')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('button.login-button')).toBeVisible();
    await page.fill('input#username', 'test');
    await expect(page.locator('input#username')).toHaveValue('test');
  });

  test('authenticated user can access forum', async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.fill('input#password', 'Testuser@123');
    await page.click('button.login-button', { force: true });
    await page.waitForURL('/home', { timeout: 10000 });
    await page.goto('/forum');
    await page.waitForLoadState('networkidle');
    await expect(page.url()).toContain('/forum');
    expect(page.url()).not.toContain('/#');
    await page.waitForTimeout(2000);
    const hasForumContent = await page.locator('text=Forum').isVisible() ||
                           await page.locator('text=posts').isVisible() ||
                           await page.locator('text=Loading').isVisible() ||
                           await page.locator('text=No posts yet').isVisible();
    
    expect(hasForumContent).toBeTruthy();
  });

  test('direct forum URL access requires authentication', async ({ page }) => {
    await page.context().clearCookies();
    
    // trying direct URL
    await page.goto('/forum');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // redirect to login
    const isRedirectedToLogin = page.url().includes('/') && !page.url().includes('/forum');
    expect(isRedirectedToLogin).toBeTruthy();
    
    await expect(page.locator('input#username')).toBeVisible();
  });

  test('title and meta info correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThan(0);
    expect(viewport?.height).toBeGreaterThan(0);
  });

  test('session across page reloads', async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.fill('input#password', 'Testuser@123');
    await page.click('button.login-button', { force: true });
    await page.waitForURL('/home', { timeout: 10000 });
    
    await page.goto('/forum');
    await page.waitForLoadState('networkidle');
    await expect(page.url()).toContain('/forum');
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.url()).toContain('/forum');
  });
});
