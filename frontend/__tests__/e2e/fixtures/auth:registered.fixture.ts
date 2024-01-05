import { existsSync } from "fs";
import path from "path";
import { test as auth } from "@/__tests__/e2e/fixtures/auth.fixture";
import type { FakeUser } from "@/__tests__/e2e/helpers/user";
import { fakeUserBase } from "@/__tests__/e2e/helpers/user";
import { LoginPage } from "@/__tests__/e2e/pages/auth/login.page";
import { RegisterPage } from "@/__tests__/e2e/pages/auth/register.page";
import { faker } from "@faker-js/faker";

import prisma from "@plan-prise/db-prisma";

import { hashPassword } from "../../../../packages/auth/src/lib/password-utils";

type ApprovedFixtures = {
  registerPage: RegisterPage;
  registeredUser: FakeUser;
};

const test = auth.extend<ApprovedFixtures, { workerStorageState: string }>({
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await use(registerPage);
  },

  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),
  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({ browser }, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const id = test.info().parallelIndex;
      const fileName = path.resolve(
        test.info().project.outputDir,
        `.auth/${id}.json`,
      );

      if (existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await use(fileName);
        return;
      }
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

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const loginPage = new LoginPage(
        await browser.newPage({ storageState: undefined }),
      );

      await loginPage.goto();
      await loginPage.populateForm(
        fakeUserApproved.email,
        fakeUserApproved.password,
      );
      await loginPage.submitForm();

      // End of authentication steps.

      await loginPage.page.context().storageState({ path: fileName });
      await loginPage.page.close();
      await use(fileName);

      await prisma.user.deleteMany({
        where: { email: fakeUserApproved.email },
      });
    },
    { scope: "worker" },
  ],
});

export default test;
