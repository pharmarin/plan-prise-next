import { faker } from "@faker-js/faker";
import { expect } from "@playwright/test";

import getUrl from "@plan-prise/api/utils/url";
import prisma from "@plan-prise/db-prisma";
import {
  getFakePlan,
  planTest as test,
} from "@plan-prise/tests/fixtures/plan.fixture";

import { extractPosologiesSettings } from "../frontend/app/(auth)/plan/functions";

enum PlanPrisePosologies {
  "poso_lever" = "Lever",
  "poso_matin" = "Matin",
  "poso_10h" = "10h",
  "poso_midi" = "Midi",
  "poso_16h" = "16h",
  "poso_18h" = "18h",
  "poso_soir" = "Soir",
  "poso_coucher" = "Coucher",
}

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

  test("should display plan", async ({ page, fakePlan }) => {
    const medicaments = await prisma.medicament.findMany({
      where: { OR: fakePlan.medicsOrder.map((medicId) => ({ id: medicId })) },
      include: { commentaires: true },
    });

    await page.goto(`/plan/${fakePlan.displayId}`);

    await expect(page.getByTestId("navbar-title")).toHaveText(
      `Plan de prise n°${fakePlan.displayId}`,
    );

    for (let index = 0; index < medicaments.length; index++) {
      const medicament = medicaments.find(
        (medicament) => medicament.id === fakePlan.medicsOrder[index],
      );

      if (!medicament) {
        throw new Error("Medicament was not found");
      }

      const row = page.getByTestId("plan-card").nth(index);
      const commentairesGroup = row.getByTestId("plan-card-commentaire-group");

      await expect(row.getByTestId("plan-card-header-denomination")).toHaveText(
        medicament.denomination,
      );
      if (medicament.indications.length === 1) {
        expect(
          await row
            .getByTestId("plan-input-indication")
            .locator("input")
            .inputValue(),
        ).toBe(medicament.indications[0] ?? "");
      } else {
        await expect(
          row.getByTestId("plan-input-indication").locator("button"),
        ).toHaveText("Choisissez une indication" ?? "");
      }

      expect(await commentairesGroup.count()).toBe(
        medicament.commentaires.length,
      );

      for (let index = 0; index < (await commentairesGroup.count()); index++) {
        const element = commentairesGroup.nth(index);

        expect(await element.locator("textarea").inputValue()).toBe(
          medicament.commentaires[index]?.texte,
        );
        expect(
          await element
            .locator("button[role=checkbox]")
            .getAttribute("data-state"),
        ).toBe(
          medicament.commentaires[index]?.population ? "unchecked" : "checked",
        );
      }
    }
  });

  test("should edit test", async ({ page, fakeUserLoggedIn }) => {
    const medicaments = await Promise.all([
      prisma.medicament.findFirstOrThrow({
        where: { denomination: { startsWith: "ELIQUIS" } },
        include: { commentaires: true },
      }),
      prisma.medicament.findFirstOrThrow({
        where: { denomination: { startsWith: "AMOXICILLINE 250 mg" } },
        include: { commentaires: true },
      }),
      prisma.medicament.findFirstOrThrow({
        where: { denomination: { startsWith: "MOVENTIG" } },
        include: { commentaires: true },
      }),
    ]);

    const fakeGeneratedPlan = getFakePlan(medicaments, fakeUserLoggedIn.id);

    const fakePlan = await prisma.plan.create({
      data: fakeGeneratedPlan,
    });

    await page.goto(`/plan/${fakePlan.displayId}`);

    const result = {} as PP.Plan.Data;

    for (let index = 0; index < medicaments.length; index++) {
      const medicament = medicaments[index];

      if (!medicament) {
        throw new Error("Medicament not found");
      }

      result[medicament.id] = {};

      const row = page.getByTestId("plan-card").nth(index);
      const commentairesGroup = row.getByTestId("plan-card-commentaire-group");

      // INDICATION

      if (medicament.indications.length > 1) {
        const randomIndex = faker.number.int({
          min: 0,
          max: medicament.indications.length - 1,
        });
        await row
          .getByTestId("plan-input-indication")
          .locator("button")
          .click();
        for (let index = 0; index < randomIndex; index++) {
          await page.keyboard.press("ArrowDown");
        }
        await page.keyboard.press("Enter");

        /* expect(
          await row
            .getByTestId("plan-input-indication")
            .locator("input")
            .inputValue(),
        ).toBe(medicament.indications[randomIndex] ?? ""); */
      }

      await row
        .getByTestId("plan-input-indication")
        .locator("input")
        .fill("test");

      await page.waitForSelector(".plan-loading-state.plan-saved");

      const planData = await prisma.plan.findFirstOrThrow({
        where: { id: fakePlan.id },
      });

      result[medicament.id]!.indication = "test";

      expect(planData.data).toEqual(result);

      // POSOLOGIES

      const displayedPosologies = extractPosologiesSettings(
        fakePlan.settings?.posos,
      ).filter(
        (posologie): posologie is keyof typeof PP.Plan.PlanPrisePosologies =>
          Boolean(posologie),
      );

      for (const posologie of displayedPosologies) {
        await row
          .getByTestId(`plan-input-posologies-${posologie}`)
          .fill("test");

        if (typeof result[medicament.id]?.posologies === "undefined") {
          result[medicament.id]!.posologies = {
            [posologie]: "test",
          } as Record<keyof typeof PP.Plan.PlanPrisePosologies, string>;
        } else {
          result[medicament.id]!.posologies![posologie] = "test";
        }
      }

      // COMMENTAIRES

      result[medicament.id]!.commentaires = {};

      for (let index = 0; index < medicament.commentaires.length; index++) {
        const element = commentairesGroup.nth(index);

        await element.locator("textarea").fill("Test commentaire");

        result[medicament.id]!.commentaires![
          medicament.commentaires[index]?.id ?? ""
        ] = {
          texte: "Test commentaire",
        };

        await element.locator("button[role=checkbox]").click();

        result[medicament.id]!.commentaires![
          medicament.commentaires[index]?.id ?? ""
        ]!.checked = !!medicament.commentaires[index]?.population;
      }
    }

    await page.waitForSelector(".plan-loading-state.plan-saved");

    const planData = await prisma.plan.findFirstOrThrow({
      where: { id: fakePlan.id },
    });

    expect(planData.data).toEqual(result);

    // SETTINGS

    await page.locator(".plan-settings-button").click();

    const settingsResult = {} as PP.Plan.Settings;
    const randomPosos = faker.helpers.arrayElements(
      Object.keys(PlanPrisePosologies),
    );
    const pososSwitches = page
      .getByTestId("plan-settings-dialog")
      .locator("button[role=switch]");

    for (let index = 0; index < (await pososSwitches.count()); index++) {
      const posoSwitch = pososSwitches.nth(index);
      const posoKey = Object.keys(PlanPrisePosologies)[index];
      const currentState = await posoSwitch.getAttribute("data-state");
      const shouldBeChecked = randomPosos.includes(posoKey ?? "");

      if (
        (currentState === "checked" && !shouldBeChecked) ||
        (currentState === "unchecked" && shouldBeChecked)
      ) {
        await posoSwitch.click();
      }

      if (!settingsResult?.posos) {
        // @ts-expect-error Type
        settingsResult.posos = {};
      }

      settingsResult.posos![
        posoKey as keyof typeof PP.Plan.PlanPrisePosologies
      ] = shouldBeChecked;
    }

    await page.keyboard.press("Escape");

    await page.waitForSelector(".plan-loading-state.plan-saved");

    const planSettings = await prisma.plan.findFirstOrThrow({
      where: { id: fakePlan.id },
    });

    expect(planSettings.settings).toEqual(settingsResult);

    await expect(
      page.locator(".plan-card-posologies").locator("input"),
    ).toHaveCount(randomPosos.length * medicaments.length);

    await prisma.plan.delete({
      where: {
        id: fakePlan.id,
      },
    });
  });
});
