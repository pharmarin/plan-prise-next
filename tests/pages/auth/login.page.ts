import type { Page } from "@playwright/test";

import logConsole from "@plan-prise/tests/helpers/console-log";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    logConsole(page);
  }

  async goto() {
    await this.page.goto("/login");
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
