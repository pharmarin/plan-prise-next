import prisma from "@/__tests__/e2e/helpers/prisma";
import { ForgotPasswordPage } from "@/__tests__/e2e/pages/auth/forgot-password.page";
import { LoginPage } from "@/__tests__/e2e/pages/auth/login.page";
import { faker } from "@faker-js/faker";
import { test as base } from "@playwright/test";
import type { User } from "@prisma/client";

export type FakeUser = Omit<
  User,
  "id" | "approvedAt" | "createdAt" | "updatedAt" | "certificate" | "maxId"
>;

type AuthFixtures = {
  forgotPasswordPage: ForgotPasswordPage;
  loginPage: LoginPage;
  fakeUser: FakeUser;
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
  fakeUser: async ({ page: _ }, use) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });

    await use({
      firstName,
      lastName,
      displayName: `${firstName} ${lastName} Display`,
      email,
      password: faker.internet.password(),
      admin: false,
      student: false,
      rpps: BigInt(faker.string.numeric(11)),
    } satisfies FakeUser);

    await prisma.user.deleteMany({ where: { email } });
  },
});
