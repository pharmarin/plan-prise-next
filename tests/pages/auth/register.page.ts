import path from "path";
import type { Page } from "@playwright/test";

import logConsole from "@plan-prise/tests/helpers/console-log";
import type { FakeUser } from "@plan-prise/tests/helpers/user";

export class RegisterPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    logConsole(page);
  }

  async goto() {
    await this.page.goto("/register");
    await this.page.waitForLoadState("networkidle");
  }

  async populateForm(fakeUser: FakeUser) {
    await this.page.fill('input[name="lastName"]', fakeUser.lastName ?? "");
    await this.page.fill('input[name="firstName"]', fakeUser.firstName ?? "");
    await this.page.fill('input[name="lastName"]', fakeUser.lastName ?? "");

    if (fakeUser.student) {
      await this.page.getByLabel("Étudiant").check();
      await this.page
        .getByLabel("Justificatif d'études de pharmacie")
        .setInputFiles(path.resolve("./pages/auth/test_pdf.pdf"));
    } else {
      await this.page.fill(
        'input[name="rpps"]',
        fakeUser.rpps ? fakeUser.rpps.toString() : "",
      );
    }

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
    const response = this.page.waitForResponse((response) => {
      //console.log("response: ", response, await response.text());
      return (
        new URL(response.url()).pathname === `/register` &&
        response.request().method() === "POST"
      );
    });

    await this.page.click('button[type="submit"]');
    await response;
  }
}
