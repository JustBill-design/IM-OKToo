import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForLoginForm() {
    await this.page.waitForSelector('.login-container', { timeout: 10000 });
    await this.page.waitForSelector('input#username', { timeout: 5000 });
    await this.page.waitForSelector('input#password', { timeout: 5000 });
    await this.page.waitForSelector('button.login-button', { timeout: 5000 });
  }

  async fillCredentials(username: string, password: string) {
    await this.page.fill('input#username', username);
    await this.page.fill('input#password', password);
  }

  async submitForm() {
    await this.page.click('button.login-button', { force: true });
  }

  async login(username: string = 'testuser', password: string = 'Testuser@123') {
    await this.goto();
    await this.waitForLoginForm();
    await this.fillCredentials(username, password);
    await this.submitForm();
  }

  async expectLoginForm() {
    await expect(this.page.locator('input#username')).toBeVisible();
    await expect(this.page.locator('input#password')).toBeVisible();
    await expect(this.page.locator('button.login-button')).toBeVisible();
  }

  async expectErrorMessage(message?: string) {
    const errorLocator = this.page.locator('.error-message').first();
    await expect(errorLocator).toBeVisible();
    if (message) {
      await expect(errorLocator).toContainText(message);
    }
  }

  async expectValidationError(fieldType: 'username' | 'password') {
    const fieldId = fieldType === 'username'? '#username' : '#password';
    const errorMessage = this.page.locator(`${fieldId} + .error-message, ${fieldId}~ .error-message`);
    await expect(errorMessage).toBeVisible();
  }
}

export class ForumPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/forum');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForForumOrLogin() {
    return Promise.race([
      this.page.waitForSelector('.forum-container, .forum-page, [data-testid="forum"]', { timeout: 8000 }),
      this.page.waitForSelector('.login-container', { timeout: 8000 }),
      this.page.waitForURL(/\/(login)?$/, {timeout: 8000 })
    ]);
  }

  async isOnForumPage(): Promise<boolean> {
    try {
      await this.page.waitForSelector('.forum-container, .forum-page', {timeout:3000 });
      return true;
    } catch {
      return false;
    }
  }

  async expectForumContent() {
    const isOnForum = await this.isOnForumPage();
    expect(isOnForum).toBeTruthy();
  }

  async expectPostsOrEmptyState() {
    const hasContent = await Promise.race([
      this.page.locator('.post-item').first().isVisible().catch(() => false),
      this.page.locator('text=No posts').isVisible().catch(() => false),
      this.page.locator('text=Managing anxiety').isVisible().catch(() => false)
    ]);
    expect(hasContent).toBeTruthy();
  }

  async clickFirstPost() {
    const firstPost = this.page.locator('.post-item').first();
    if (await firstPost.isVisible()) {
      await firstPost.click();
      await this.page.waitForTimeout(1000);
    }
  }
}

export class NavigationHelpers {
  constructor(private page: Page) {}

  async expectOnHomePage() {
    await Promise.race([
      this.page.waitForURL(/\/home/, {timeout:15000 }),
      this.page.waitForSelector('.login-container', {timeout: 15000 })
    ]);
    
    if (this.page.url().includes('/home')) {
      return true;
    }
    return false;
  }

  async expectRedirectToLogin() {
    await this.page.waitForURL(/\/(login)?$/, { timeout: 10000 });
    await this.page.waitForSelector('.login-container', { timeout: 5000 });
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      await this.page.goto('/home');
      await this.page.waitForTimeout(2000);
      return this.page.url().includes('/home');
    } catch {
      return false;
    }
  }

  async navigateTo(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }
}

export async function loginUser(page: Page, username: string = 'testuser', password: string = 'Testuser@123') {
  const loginPage = new LoginPage(page);
  await loginPage.login(username, password);
  
  const navHelper = new NavigationHelpers(page);
  return await navHelper.expectOnHomePage();
}

export async function clearAuthState(page: Page) {
  try {
    await page.context().clearCookies();
  } catch (error) {
    console.log('clearing');
  }
  
  try {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  } catch (error) {
    console.log('continuing:', error);
  }
}

export async function waitForPageLoad(page: Page, timeout: number = 10000) {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function expectToBeOnPage(page: Page, path: string) {
  await page.waitForURL(new RegExp(path), { timeout: 10000 });
  expect(page.url()).toContain(path);
}
