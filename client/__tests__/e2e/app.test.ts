import { expect, test } from "@playwright/experimental-ct-react";

test("is loading", async ({ page }) => {
  await page.goto("/");

  const loadingScreen = page.getByText("Chargement en cours...");

  expect(loadingScreen).not.toBeUndefined();
});
