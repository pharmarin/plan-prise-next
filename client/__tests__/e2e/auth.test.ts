import { test } from "@/__tests__/e2e/fixtures/auth.fixture";
import errors from "@/utils/errors/errors.json";
import { expect } from "@playwright/experimental-ct-react";

test.describe("auth", () => {
  test("should redirect unauthorized user to the login page", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(
      `${process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000"}/login`
    );
  });

  test("should display an error if the user is not registered", async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.populateForm("fake.mail@mail.com", "fake_password");
    await loginPage.submitForm();
    await expect(page.getByText(errors.USER_LOGIN_ERROR)).toBeVisible();
  });
});
