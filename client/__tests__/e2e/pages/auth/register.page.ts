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

  async populateForm(user: FakeUser) {
    await this.page.fill('input[name="email"]', user.email);
  }

  async submitForm() {
    await this.page.click('button[type="submit"]');
    await this.page.waitForLoadState("networkidle");
  }
}
