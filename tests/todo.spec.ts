
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker'; // ✅ Import Faker
import User from '../models/User';
import UserApi from '../apis/UserApi';
import TodoPage from '../pages/TodoPage';
import NewTodoPage from '../pages/NewTodoPage';

const BASE_URL = 'https://todo.qacart.com';

test.describe('Todo App', () => {
  let user: User;

  test.beforeEach(async ({ page, request, context }) => {
    // 1. Generate unique user data with Faker
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const password = faker.internet.password({ length: 10 });

    // Create user instance (adjust constructor if needed)
    // If User expects { firstName, lastName, email, password }:
    user = new User({ firstName, lastName, email, password });
    // If User uses setters instead:
    // user = new User();
    // user.setFirstName(firstName);
    // user.setLastName(lastName);
    // user.setEmail(email);
    // user.setPassword(password);

    // 2. Register via API
    const userApi = new UserApi(request);
    await userApi.register(user);

    // 3. Set cookies (unchanged)
    const token = user.getAccessToken();
    const userId = user.getUserId();

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

    // 4. Set localStorage (fixed to use actual userId and firstName)
    await page.goto(BASE_URL);
    await page.evaluate(({ token, userId, firstName }) => {
      const keys = ['access_token', 'token', 'jwt', 'auth_token'];
      keys.forEach(key => localStorage.setItem(key, token));
      localStorage.setItem('userID', userId);
      localStorage.setItem('firstName', firstName);
    }, { token, userId, firstName });

    await page.waitForTimeout(1000); // Wait for storage to settle
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