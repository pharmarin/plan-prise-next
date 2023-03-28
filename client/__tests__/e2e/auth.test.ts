import errors from "@/utils/errors/errors.json";
import { test } from "@/__tests__/e2e/fixtures/auth.fixture";
import { expect } from "@playwright/test";

test.describe("auth", () => {
  test("should redirect unauthorized user to the login page", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(
      `https://${
        process.env.PLAYWRIGHT_TEST_BASE_URL || "localhost:3000"
      }/login`
    );
  });

  test("should display an error if the user is not registered", async ({
    loginPage,
    page,
  }) => {
    await loginPage.populateForm("fake.mail@mail.com", "fake_password");
    await loginPage.submitForm();
    await expect(page.getByText(errors.USER_LOGIN_ERROR)).toBeVisible();
  });
});
