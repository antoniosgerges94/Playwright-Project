
import type { Cookie } from '@playwright/test';
import { faker } from '@faker-js/faker';

interface UserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default class User {
  private readonly firstName: string;
  private readonly lastName: string;
  private readonly email: string;
  private readonly password: string;
  private accessToken: string | null = null;
  private userId: string | null = null;

  constructor({ firstName, lastName, email, password }: UserParams) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  static random(): User {
    return new User({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
  }

  getFirstName(): string { return this.firstName; }
  getLastName(): string { return this.lastName; }
  getEmail(): string { return this.email; }
  getPassword(): string { return this.password; }

  setAccessToken(token: string): void { this.accessToken = token; }
  getAccessToken(): string {
    if (!this.accessToken) throw new Error('Access token was not set.');
    return this.accessToken;
  }

  setUserId(id: string): void { this.userId = id; }
  getUserId(): string {
    if (!this.userId) throw new Error('User ID was not set.');
    return this.userId;
  }

  toRegisterPayload(): UserParams {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };
  }

  toCookies(baseURL: string): Cookie[] {
    const { hostname } = new URL(baseURL);
    const cookieDefaults = {
      domain: hostname,
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      httpOnly: false,   // ⬅️ Allow JavaScript to read the cookie
      secure: false,
      sameSite: 'Lax' as const,
    };

    return [
      {
        ...cookieDefaults,
        name: 'access_token',
        value: this.getAccessToken(),
      },
      {
        ...cookieDefaults,
        name: 'userID',
        value: this.getUserId(),
      },
      {
        ...cookieDefaults,
        name: 'firstName',
        value: this.getFirstName(),
      },
    ];
  }
}