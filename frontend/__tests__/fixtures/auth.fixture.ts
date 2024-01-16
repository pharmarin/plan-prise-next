import { faker } from "@faker-js/faker";
import { test as base } from "@playwright/test";

import { hashPassword } from "@plan-prise/auth/lib/password-utils";
import prisma from "@plan-prise/tests/helpers/prisma";
import type { FakeUser } from "@plan-prise/tests/helpers/user";
import { fakeUserBase } from "@plan-prise/tests/helpers/user";
import { ForgotPasswordPage } from "@plan-prise/tests/pages/auth/forgot-password.page";
import { LoginPage } from "@plan-prise/tests/pages/auth/login.page";
import { RegisterPage } from "@plan-prise/tests/pages/auth/register.page";

type AuthFixtures = {
  forgotPasswordPage: ForgotPasswordPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  fakeUserApproved: FakeUser;
  fakeUserNotApproved: FakeUser;
};

export const test = base.extend<AuthFixtures>({
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

    const fakeUserApproved = {
      ...userBase,
      approvedAt: faker.date.between({
        from: userBase.createdAt,
        to: new Date(),
      }),
    };

    await prisma.user.create({
      data: {
        ...fakeUserApproved,
        password: await hashPassword(fakeUserApproved.password),
      },
    });

    await use(fakeUserApproved);

    await prisma.user.deleteMany({ where: { email: fakeUserApproved.email } });
  },
  fakeUserNotApproved: async ({ page: _ }, use) => {
    const userBase = fakeUserBase();

    const fakeUserApproved = {
      ...userBase,
    };

    await prisma.user.create({
      data: {
        ...fakeUserApproved,
        password: await hashPassword(fakeUserApproved.password),
      },
    });

    await use(fakeUserApproved);

    await prisma.user.deleteMany({ where: { email: fakeUserApproved.email } });
  },
});
