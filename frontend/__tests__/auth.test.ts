import { test } from "@/__tests__/fixtures/auth.fixture";
import { fakeUserBase } from "@/__tests__/helpers/user";
import { expect } from "@playwright/test";
import { startCase, toUpper } from "lodash";

import prisma from "@plan-prise/db-prisma";
import errors from "@plan-prise/errors/errors.json";

import getUrl from "../../packages/api/src/utils/url";
import { checkPassword } from "../../packages/auth/src/lib/password-utils";

test.describe("auth", () => {
  test("should redirect unauthorized user to the login page", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveURL(getUrl("/login"));
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

    await expect(page).toHaveURL(getUrl("/"));

    await expect(page.getByTestId("title")).toHaveText("Bienvenue");
  });

  test("should register user", async ({ registerPage, page }) => {
    const fakeUser = fakeUserBase();

    await registerPage.populateForm(fakeUser);
    await registerPage.submitForm();

    const registeredUser = await prisma.user.findFirst({
      where: {
        email: fakeUser.email,
      },
    });

    expect(registeredUser?.email).toBe(fakeUser.email);
    expect(checkPassword(fakeUser.password, registeredUser?.password ?? ""));
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

    await expect(page.getByTestId("form-success-title")).toHaveText(
      "Demande d'inscription terminée",
    );

    await prisma.user.delete({ where: { id: registeredUser?.id } });
  });
});
