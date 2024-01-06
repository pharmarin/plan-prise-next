import type { FakeUser } from "@/__tests__/e2e/helpers/user";
import type { Page } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/register");
    await this.page.waitForLoadState("networkidle");
  }

  async populateForm(fakeUser: FakeUser) {
    await this.page.fill('input[name="lastName"]', fakeUser.lastName ?? "");
    await this.page.fill('input[name="firstName"]', fakeUser.firstName ?? "");
    await this.page.fill('input[name="lastName"]', fakeUser.lastName ?? "");
    await this.page.fill(
      'input[name="rpps"]',
      fakeUser.rpps ? fakeUser.rpps.toString() : "",
    );

    await this.page.click('button[type="submit"]');

    await this.page.fill(
      'input[name="displayName"]',
      fakeUser.displayName ?? "",
    );
    await this.page.fill('input[name="email"]', fakeUser.email);
    await this.page.fill('input[name="password"]', fakeUser.password);
    await this.page.fill(
      'input[name="password_confirmation"]',
      fakeUser.password,
    );
  }

  async submitForm() {
    const response = this.page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === `/api/v1/users.register`,
    );

    await this.page.click('button[type="submit"]');
    await response;
  }
}
