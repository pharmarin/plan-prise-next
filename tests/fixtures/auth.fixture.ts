import { faker } from "@faker-js/faker";
import { test as base } from "@playwright/test";

import { hashPassword } from "@plan-prise/auth/lib/password-utils";
import { User } from "@plan-prise/db-prisma";
import prisma from "@plan-prise/tests/helpers/prisma";
import { fakeUserBase } from "@plan-prise/tests/helpers/user";
import { ForgotPasswordPage } from "@plan-prise/tests/pages/auth/forgot-password.page";
import { LoginPage } from "@plan-prise/tests/pages/auth/login.page";
import { RegisterPage } from "@plan-prise/tests/pages/auth/register.page";

type AuthFixtures = {
  forgotPasswordPage: ForgotPasswordPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  fakeUserApproved: User;
  fakeUserNotApproved: User;
  fakeUserAdmin: User;
  fakeUserLoggedIn: User;
};

export const authTest = base.extend<AuthFixtures>({
  forgotPasswordPage: async ({ page }, use) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
    await use(forgotPasswordPage);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await use(registerPage);
  },
  fakeUserApproved: async ({ page: _ }, use) => {
    const userBase = fakeUserBase();

    const fakeData = {
      ...userBase,
      approvedAt: faker.date.between({
        from: userBase.createdAt,
        to: new Date(),
      }),
    };

    const fakeUserApproved = await prisma.user.create({
      data: {
        ...fakeData,
        password: await hashPassword(fakeData.password),
      },
    });

    await use(fakeUserApproved);

    await prisma.user.deleteMany({ where: { email: fakeData.email } });
  },
  fakeUserNotApproved: async ({ page: _ }, use) => {
    const userBase = fakeUserBase();

    const fakeData = {
      ...userBase,
    };

    const fakeUserNotApproved = await prisma.user.create({
      data: {
        ...fakeData,
        password: await hashPassword(fakeData.password),
      },
    });

    await use(fakeUserNotApproved);

    await prisma.user.deleteMany({ where: { email: fakeData.email } });
  },
  fakeUserAdmin: async ({ page: _ }, use) => {
    const userBase = fakeUserBase();

    const fakeData = {
      ...userBase,
      approvedAt: faker.date.between({
        from: userBase.createdAt,
        to: new Date(),
      }),
      admin: true,
    };

    const fakeAdmin = await prisma.user.create({
      data: {
        ...fakeData,
        password: await hashPassword(fakeData.password),
      },
    });

    await use(fakeAdmin);

    await prisma.user.deleteMany({
      where: { email: fakeData.email },
    });
  },
  fakeUserLoggedIn: async (
    { page: _, fakeUserApproved, loginPage, context },
    use,
  ) => {
    await loginPage.goto();
    await loginPage.populateForm(
      fakeUserApproved.email,
      fakeUserApproved.password,
    );
    await loginPage.submitForm();

    use(fakeUserApproved);
  },
});
