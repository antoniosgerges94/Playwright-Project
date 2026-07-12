
import { APIRequestContext, APIResponse } from '@playwright/test';
import User from '../models/User';

export default class TodoApi {
  constructor(private request: APIRequestContext) {}

  async addTodo(
    user: User,
    item: string,
    isCompleted = false
  ): Promise<APIResponse> {
    const response = await this.request.post('/api/v1/tasks', {
      data: {
        item,
        isCompleted,
      },
      headers: {
        Authorization: `Bearer ${user.getAccessToken()}`,
      },
    });

    if (response.status() !== 201) {
      throw new Error(
        `Todo creation failed: ${response.status()} ${await response.text()}`
      );
    }

    return response;
  }
}