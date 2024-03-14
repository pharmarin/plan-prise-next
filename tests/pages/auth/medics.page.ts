import type { Page } from "@playwright/test";

import logConsole from "@plan-prise/tests/helpers/console-log";

export class MedicsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    logConsole(page);
  }

  async goto(id: string) {
    await this.page.goto(`/admin/medicaments/${id}`);
    await this.page.waitForLoadState("networkidle");
  }
}
