import { expect } from "@playwright/test";

import getUrl from "@plan-prise/api/utils/url";
import prisma from "@plan-prise/db-prisma";
import { planTest as test } from "@plan-prise/tests/fixtures/plan.fixture";

test.describe("plan tests", () => {
  test("should display access plan index page", async ({
    page,
    fakePlans: _fakePlans,
    fakeUserLoggedIn,
  }) => {
    await page.goto("/");

    await page.getByText("Plan de prise").click();
    await page.waitForURL("/plan");

    expect(page.url()).toBe(getUrl("/plan"));

    await expect(page.getByTestId("navbar-title")).toHaveText(
      "Vos plans de prise",
    );

    const planCount = await prisma.plan.count({
      where: { userId: fakeUserLoggedIn.id },
    });
    const tileCount = await page.getByTestId("plan-index-tile").count();

    expect(tileCount).toBe(planCount);
  });
});
