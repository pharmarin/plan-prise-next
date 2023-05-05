import PP_Error from "@/utils/errors";
import { expect, test } from "@playwright/test";

test.describe("tRPC tests", () => {
  test("should succeed guest query", async ({ page }) => {
    await page.goto("/status");

    await page.getByTitle("Guest Query Result").waitFor();

    await expect(page.getByTitle("Guest Query Result")).toHaveText("success");
  });

  test("should fail auth query", async ({ page }) => {
    await page.goto("/status");

    await page.getByTitle("Auth Query Result").waitFor();

    await expect(page.getByTitle("Auth Query Result")).toHaveText(
      new PP_Error("UNAUTHORIZED_AUTH").message
    );
  });
});
