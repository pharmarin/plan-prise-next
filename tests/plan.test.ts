import { expect } from "@playwright/test";

import { planTest as test } from "@plan-prise/tests/fixtures/plan.fixture";

test.describe("plan tests", () => {
  test("should display access plan index page", async ({
    page,
    fakePlans,
    fakeUserLoggedIn,
  }) => {
    const user = fakeUserLoggedIn;

    await page.goto("/");

    await page.getByText("Plan de prise").click();

    expect(page.url()).toBe("/plan");

    expect(page.getByTestId("navbar-title")).toBe("Vos plans de prise");
  });
});
