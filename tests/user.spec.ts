
import { test } from '@playwright/test';
import User from '../models/User';
import RegisterPage from '../pages/RegisterPage';

test.describe('Registration', () => {
  test('should register a new user successfully', async ({ page }) => {
    const user = User.random();
    const registerPage = new RegisterPage(page);

    await registerPage.register(user);
    await registerPage.expectWelcomeMessage();
  });
});