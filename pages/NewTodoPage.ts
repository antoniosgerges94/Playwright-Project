
import { expect, Page } from '@playwright/test';

export default class NewTodoPage {
  constructor(private page: Page) {}

  private newTodoInput = '[data-testid="new-todo"]';
  private submitButton = '[data-testid="submit-newTask"]';
  private todoItems = '[data-testid="todo-item"]';

  async waitForForm() {
    await expect(this.page.locator(this.newTodoInput)).toBeVisible({ timeout: 15000 });
  }

  async enterTodo(item: string) {
    await this.page.fill(this.newTodoInput, item);
  }

  async submit() {
    await this.page.click(this.submitButton);
  }

  async createTodo(item: string) {
    await this.waitForForm();
    await this.enterTodo(item);
    await this.submit();
  }

  async expectTodoCreated(item: string) {
    await expect(this.page.locator(this.todoItems).first()).toHaveText(item, { timeout: 15000 });
  }
}