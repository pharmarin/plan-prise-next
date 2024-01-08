import { test } from "@/__tests__/e2e/fixtures/auth.fixture";
import { baseUrl } from "@/__tests__/e2e/helpers/url";
import { fakeUserBase } from "@/__tests__/e2e/helpers/user";
import { expect } from "@playwright/test";
import { startCase, toUpper } from "lodash";

import prisma from "@plan-prise/db-prisma";
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
    await loginPage.populateForm(
      fakeUserApproved.email,
      fakeUserApproved.password,
    );
    await loginPage.submitForm();

    await expect(page).toHaveURL(`${baseUrl}/`);

    await expect(page.getByTestId("title")).toHaveText("Bienvenue");
  });

  test("should register user", async ({ registerPage }) => {
    const fakeUser = fakeUserBase();

    await registerPage.populateForm(fakeUser);
    await registerPage.submitForm();

    const registeredUser = await prisma.user.findFirst({
      where: {
        email: fakeUser.email,
      },
    });

    expect(registeredUser?.email).toBe(fakeUser.email);
    expect(registeredUser?.firstName).toBe(
      startCase((fakeUser.firstName ?? "").toLowerCase()),
    );
    expect(registeredUser?.lastName).toBe(toUpper(fakeUser.lastName ?? ""));
    expect(registeredUser?.displayName).toBe(
      startCase((fakeUser.displayName ?? "").toLowerCase()),
    );
    expect(registeredUser?.admin).toBe(false);
    expect(registeredUser?.student).toBe(false);
    expect(registeredUser?.approvedAt).toBe(null);

    expect(registerPage.page.getByTestId("form-success-title")).toBe(
      "Demande d'inscription terminée",
    );
  });
});
