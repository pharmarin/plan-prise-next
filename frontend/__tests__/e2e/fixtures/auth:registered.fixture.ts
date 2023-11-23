import type { FakeUser } from "@/__tests__/e2e/fixtures/auth.fixture";
import { test as auth } from "@/__tests__/e2e/fixtures/auth.fixture";
import { RegisterPage } from "@/__tests__/e2e/pages/auth/register.page";

interface ApprovedFixtures {
  registerPage: RegisterPage;
  registeredUser: FakeUser;
}

const test = auth.extend<ApprovedFixtures>({
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await use(registerPage);
  },
  registeredUser: async ({ browser, fakeUser }, use) => {
    const registerPage = new RegisterPage(await browser.newPage());
    await registerPage.goto();
    await registerPage.populateForm(fakeUser);
    await registerPage.submitForm();
    await registerPage.page.close();
    await use(fakeUser);
  },
});

export default test;
