import { baseUrl } from "@/__tests__/e2e/helpers/url";
import type { Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(`${baseUrl}/login`);
    await this.page.waitForLoadState("networkidle");
  }

  async populateForm(email: string, password: string) {
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
  }

  async submitForm() {
    const response = this.page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === "/api/auth/callback/credentials",
    );

    await this.page.click('button[type="submit"]');
    await response;
  }
}
