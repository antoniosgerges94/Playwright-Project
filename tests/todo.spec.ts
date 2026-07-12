
import { test, expect } from '@playwright/test';
import User from '../models/User';
import UserApi from '../apis/UserApi';
import TodoPage from '../pages/TodoPage';
import NewTodoPage from '../pages/NewTodoPage';

const BASE_URL = 'https://todo.qacart.com';

test.describe('Todo App', () => {
  let user: User;

  test.beforeEach(async ({ page, request, context }) => {
    // 1. Register via API (fast and reliable)
    user = User.random();
    const userApi = new UserApi(request);
    await userApi.register(user);

    // 2. Set cookies with multiple key names
    const token = user.getAccessToken();
    const userId = user.getUserId();
    const firstName = user.getFirstName();

    const cookieNames = ['access_token', 'token', 'jwt', 'auth_token'];
    for (const name of cookieNames) {
      await context.addCookies([
        {
          name,
          value: token,
          domain: new URL(BASE_URL).hostname,
          path: '/',
          expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
          httpOnly: false,
          secure: false,
          sameSite: 'Lax' as const,
        },
      ]);
    }
    // Also set userID and firstName cookies if needed
    await context.addCookies([
      {
        name: 'userID',
        value: userId,
        domain: new URL(BASE_URL).hostname,
        path: '/',
        expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax' as const,
      },
      {
        name: 'firstName',
        value: firstName,
        domain: new URL(BASE_URL).hostname,
        path: '/',
        expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax' as const,
      },
    ]);

    // 3. Set localStorage with multiple keys
    await page.goto(BASE_URL);
    await page.evaluate((token) => {
      const keys = ['access_token', 'token', 'jwt', 'auth_token'];
      keys.forEach(key => localStorage.setItem(key, token));
      // Also set userID and firstName in localStorage if needed
      localStorage.setItem('userID', '{{userId}}');
      localStorage.setItem('firstName', '{{firstName}}');
    }, token);

    // Wait a moment for storage to settle
    await page.waitForTimeout(1000);

    // 4. Now navigate to the todo page (skip UI login)
  });

  test('should add a todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const newTodoPage = new NewTodoPage(page);

    await todoPage.visit();
    await todoPage.clickAddTodo();
    await newTodoPage.createTodo('Playwright');
    await newTodoPage.expectTodoCreated('Playwright');
  });

  test('should delete a todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const newTodoPage = new NewTodoPage(page);

    await todoPage.visit();
    await todoPage.clickAddTodo();
    await newTodoPage.createTodo('Playwright');
    await todoPage.deleteFirstTodo();
    await todoPage.expectNoTodos();
  });
});