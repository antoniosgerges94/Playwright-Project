
import { expect, Page } from '@playwright/test';

export default class TodoPage {
  constructor(private page: Page) {}

  private addButton = '[data-testid="add"]';
  private deleteButton = '[data-testid="delete"]';
  private noTodosMessage = '[data-testid="no-todos"]';
  private todoItem = '[data-testid="todo-item"]';

  async visit() {
    await this.page.goto('/todo');
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.locator(this.addButton)).toBeVisible({ timeout: 20000 });
  }

  async clickAddTodo() {
    await expect(this.page.locator(this.addButton)).toBeVisible({ timeout: 20000 });
    await this.page.click(this.addButton);
  }

  async deleteFirstTodo() {
    await expect(this.page.locator(this.deleteButton)).toBeVisible({ timeout: 20000 });
    await this.page.click(this.deleteButton);
  }

  async expectNoTodos() {
    await expect(this.page.locator(this.noTodosMessage)).toBeVisible({ timeout: 20000 });
  }

  async getTodoTextByIndex(index: number): Promise<string> {
    return await this.page.locator(this.todoItem).nth(index).innerText();
  }
}