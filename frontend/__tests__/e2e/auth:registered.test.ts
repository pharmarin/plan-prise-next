import test from "@/__tests__/e2e/fixtures/auth:registered.fixture";
import { expect } from "@playwright/test";

import errors from "@plan-prise/errors/errors.json";

test.describe("auth:registered", () => {
  test("should display error message if user not approved", async ({
    registeredUser,
    loginPage,
    page,
  }) => {
    await loginPage.populateForm(registeredUser.email, registeredUser.password);
    await loginPage.submitForm();
    await expect(
      page.getByText(errors.USER_NOT_APPROVED.message),
    ).toBeVisible();
  });
});
