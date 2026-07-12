
import { Page, expect } from '@playwright/test';
import User from '../models/User';

export default class LoginPage {
  constructor(private page: Page) {}

  private emailInput = '[data-testid="email"]';
  private passwordInput = '[data-testid="password"]';
  private loginButton = '[data-testid="submit-login"]';

  async visit() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(user: User) {
    await this.visit();

    // Debug: take a screenshot if login elements are not found
    try {
      await expect(this.page.locator(this.emailInput)).toBeVisible({ timeout: 10000 });
    } catch (error) {
      await this.page.screenshot({ path: 'login-page-error.png' });
      throw new Error(`Login page did not load correctly. Screenshot saved. ${error}`);
    }

    await this.page.fill(this.emailInput, user.getEmail());
    await this.page.fill(this.passwordInput, user.getPassword());
    await this.page.click(this.loginButton);
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveURL(/.*\/todo/, { timeout: 10000 });
  }
}