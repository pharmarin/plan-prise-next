import { faker } from "@faker-js/faker";
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

  test("should display plan", async ({ page, fakePlans }) => {
    const randomPlan = faker.helpers.arrayElement(fakePlans);
    const firstRowMedic = await prisma.medicament.findFirstOrThrow({
      where: { id: randomPlan.medicsOrder[0] },
      include: { commentaires: true },
    });

    await page.goto(`/plan/${randomPlan.displayId}`);

    await expect(page.getByTestId("navbar-title")).toHaveText(
      `Plan de prise n°${randomPlan.displayId}`,
    );

    await expect(
      page.getByTestId("plan-card-header-denomination").first(),
    ).toHaveText(firstRowMedic.denomination);
    if (firstRowMedic.indications.length === 1) {
      expect(
        await page
          .getByTestId("plan-card-indication-input")
          .first()
          .locator("input")
          .inputValue(),
      ).toBe(firstRowMedic.indications[0] ?? "");
    } else {
      await expect(
        page
          .getByTestId("plan-card-indication-input")
          .first()
          .locator("button"),
      ).toHaveText("Choisissez une indication" ?? "");
    }

    const commentairesGroup = page
      .getByTestId("plan-card")
      .first()
      .getByTestId("plan-card-commentaire-group");

    expect(await commentairesGroup.count()).toBe(
      firstRowMedic.commentaires.length,
    );

    for (let index = 0; index < (await commentairesGroup.count()); index++) {
      const element = commentairesGroup.nth(index);

      expect(await element.locator("textarea").inputValue()).toBe(
        firstRowMedic.commentaires[index]?.texte,
      );
      expect(
        await element
          .locator("button[role=checkbox]")
          .getAttribute("data-state"),
      ).toBe(
        firstRowMedic.commentaires[index]?.population ? "unchecked" : "checked",
      );
    }
  });

  test("should edit test", async ({ page }) => {});
});
