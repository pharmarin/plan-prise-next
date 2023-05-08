import { expect, test } from "@playwright/test";

test.describe("backend tests", () => {
  test("should redirect to frontend on base route", async ({ page }) => {
    await page.goto(process.env.BACKEND_URL);

    expect(page.url()).toBe(process.env.FRONTEND_URL + "/");
  });
});
