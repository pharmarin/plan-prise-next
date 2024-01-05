import { test } from "@/__tests__/e2e/fixtures/auth.fixture";
import { baseUrl } from "@/__tests__/e2e/helpers/url";
import { expect } from "@playwright/test";

import errors from "@plan-prise/errors/errors.json";

test.describe("auth", () => {
  test("should redirect unauthorized user to the login page", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveURL(`${baseUrl}/login`);
  });

  test("should display an error if the user is not registered", async ({
    loginPage,
  }) => {
    await loginPage.goto();
    await loginPage.populateForm("fake.mail@mail.com", "fake_password");
    await loginPage.submitForm();

    await expect(
      loginPage.page.getByText(errors.USER_LOGIN_ERROR),
    ).toBeVisible();
  });

  test("should display an error if the user is not approved", async ({
    loginPage,
    fakeUserNotApproved,
  }) => {
    await loginPage.goto();
    await loginPage.populateForm(
      fakeUserNotApproved.email,
      fakeUserNotApproved.password,
    );
    await loginPage.submitForm();

    await expect(
      loginPage.page.getByText(errors.USER_NOT_APPROVED.message),
    ).toBeVisible();
  });

  test("should log user in if user is registered", async ({
    loginPage,
    fakeUserApproved,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.populateForm(
      fakeUserApproved.email,
      fakeUserApproved.password,
    );
    await loginPage.submitForm();

    await expect(page).toHaveURL(`${baseUrl}/`);

    await expect(page.getByTestId("title")).toHaveText("Bienvenue");
  });
});
