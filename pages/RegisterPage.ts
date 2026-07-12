
import { APIRequestContext, expect, Page } from '@playwright/test';
import User from '../models/User';
import config from '../playwright.config';

export default class RegisterPage {
  constructor(
    private page: Page,
    private request?: APIRequestContext
  ) {}

  // =========================
  // Locators
  // =========================
  private firstName = '[data-testid="first-name"]';
  private lastName = '[data-testid="last-name"]';
  private email = '[data-testid="email"]';
  private password = '[data-testid="password"]';
  private confirmPassword = '[data-testid="confirm-password"]';
  private submitButton = '[data-testid="submit"]';
  private welcomeMessage = '[data-testid="welcome"]';

  // =========================
  // UI Registration
  // =========================
  async visit() {
    await this.page.goto('/signup');
  }

  async fillRegistrationForm(user: User) {
    await this.page.fill(this.firstName, user.getFirstName());
    await this.page.fill(this.lastName, user.getLastName());
    await this.page.fill(this.email, user.getEmail());
    await this.page.fill(this.password, user.getPassword());
    await this.page.fill(this.confirmPassword, user.getPassword());
  }

  async submit() {
    await this.page.click(this.submitButton);
  }

  async register(user: User) {
    await this.visit();
    await this.fillRegistrationForm(user);
    await this.submit();
  }

  async expectWelcomeMessage() {
    await expect(this.page.locator(this.welcomeMessage)).toBeVisible();
  }

  // =========================
  // API Registration (optional)
  // =========================
  async registerUsingAPI(user: User) {
    if (!this.request) {
      throw new Error(
        'APIRequestContext was not provided to RegisterPage.'
      );
    }

    const response = await this.request.post('/api/v1/users/register', {
      data: user.toRegisterPayload(),
    });

    if (!response.ok()) {
      throw new Error(
        `Registration failed: ${response.status()} ${await response.text()}`
      );
    }

    const body = await response.json();
    user.setAccessToken(body.access_token);
    user.setUserId(String(body.userID));
  }

  // =========================
  // Session Cookie Injection
  // =========================
  /**
   * Injects the user's session cookies into the browser context
   * so that the browser appears authenticated.
   */
  async setSessionCookies(user: User) {
    const context = this.page.context();
    const baseURL = config.use?.baseURL;

    if (!baseURL) {
      throw new Error('baseURL is not defined in playwright.config');
    }

    // Ensure the user object has the required data
    const accessToken = user.getAccessToken?.() ?? user['accessToken'];
    const userId = user.getUserId?.() ?? user['userId'];
    const firstName = user.getFirstName?.() ?? user['firstName'];

    if (!accessToken || !userId) {
      throw new Error('User object is missing accessToken or userId');
    }

    await context.addCookies([
      {
        name: 'access_token',
        value: accessToken,
        url: baseURL,
      },
      {
        name: 'firstName',
        value: firstName,
        url: baseURL,
      },
      {
        name: 'userId',
        value: userId,
        url: baseURL,
      },
    ]);
  }

  /**
   * Registers a user via API and then sets the session cookies
   * so the browser is authenticated for subsequent UI actions.
   */
  async registerAndLoginViaAPI(user: User) {
    await this.registerUsingAPI(user);
    await this.setSessionCookies(user);
    // Now the browser is logged in – you can navigate to protected pages.
  }
}