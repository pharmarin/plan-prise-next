import logConsole from "@/__tests__/helpers/console-log";
import type { Page } from "@playwright/test";

export class ForgotPasswordPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    logConsole(page);
  }

  async goto() {
    await this.page.goto("/forgot-password");
    await this.page.waitForURL("/forgot-password");
  }

  async populateForm(email: string) {
    await this.page.fill('input[name="email"]', email);
  }

  async submitForm() {
    const response = this.page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname ===
        "/api/v1/users.sendPasswordResetLink",
    );

    await this.page.click('button[type="submit"]');
    await response;
  }
}
