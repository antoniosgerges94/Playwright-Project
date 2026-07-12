
import { APIRequestContext } from '@playwright/test';
import User from '../models/User';

export default class UserApi {
  constructor(private request: APIRequestContext) {}

  async register(user: User): Promise<void> {
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
}