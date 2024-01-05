import prisma from "@/__tests__/e2e/helpers/prisma";
import type { FakeUser } from "@/__tests__/e2e/helpers/user";
import { fakeUserBase } from "@/__tests__/e2e/helpers/user";
import { ForgotPasswordPage } from "@/__tests__/e2e/pages/auth/forgot-password.page";
import { LoginPage } from "@/__tests__/e2e/pages/auth/login.page";
import { faker } from "@faker-js/faker";
import { test as base } from "@playwright/test";

import { hashPassword } from "../../../../packages/auth/src/lib/password-utils";

type AuthFixtures = {
  forgotPasswordPage: ForgotPasswordPage;
  loginPage: LoginPage;
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
