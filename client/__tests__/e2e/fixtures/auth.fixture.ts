import prisma from "@/__tests__/e2e/helpers/prisma";
import { ForgotPasswordPage } from "@/__tests__/e2e/pages/auth/forgot-password.page";
import { LoginPage } from "@/__tests__/e2e/pages/auth/login.page";
import { faker } from "@faker-js/faker";
import { test as base } from "@playwright/test";
import { type User } from "@prisma/client";

export type FakeUser = Omit<
  User,
  "id" | "approvedAt" | "createdAt" | "updatedAt" | "certificate"
>; //& { mailSlurpInboxId: string };

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
  fakeUser: async ({}, use) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    /* const { emailAddress: email, id: mailSlurpInboxId } =
      await mailslurp.createInbox(); */
    const email = faker.internet.email(
      firstName,
      lastName,
      (process.env.MAIL_TEST_DOMAIN || "").replace(/^./, "")
    );

    await use({
      firstName,
      lastName,
      displayName: `${firstName} ${lastName} Display`,
      email,
      //mailSlurpInboxId,
      password: faker.internet.password(),
      admin: false,
      student: false,
      rpps: BigInt(faker.random.numeric(11)),
    });

    await prisma.user.deleteMany({ where: { email } });
  },
});
