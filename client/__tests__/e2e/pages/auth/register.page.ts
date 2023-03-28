import { type FakeUser } from "@/__tests__/e2e/fixtures/auth.fixture";
import { type Page } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/register");
    await this.page.waitForURL("/register");
  }

  async populateForm(fakeUser: FakeUser) {
    await this.page.fill('input[name="lastName"]', fakeUser.lastName || "");
    await this.page.fill('input[name="firstName"]', fakeUser.firstName || "");
    await this.page.fill('input[name="lastName"]', fakeUser.lastName || "");
    await this.page.fill(
      'input[name="rpps"]',
      fakeUser.rpps ? fakeUser.rpps.toString() : ""
    );

    await this.page.click('button[type="submit"]');

    await this.page.fill(
      'input[name="displayName"]',
      fakeUser.displayName || ""
    );
    await this.page.fill('input[name="email"]', fakeUser.email);
    await this.page.fill('input[name="password"]', fakeUser.password);
    await this.page.fill(
      'input[name="password_confirmation"]',
      fakeUser.password
    );
  }

  async submitForm() {
    await this.page.click('button[type="submit"]');
    await this.page.waitForResponse("/api/v1/users.register");
  }
}
