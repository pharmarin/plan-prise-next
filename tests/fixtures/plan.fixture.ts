import { faker } from "@faker-js/faker";
import { isNil, omitBy } from "lodash";

import prisma, { Medicament, Plan } from "@plan-prise/db-prisma";

import { authTest } from "./auth.fixture";

type PlanFixture = {
  fakePlans: Plan[];
};

export const planTest = authTest.extend<PlanFixture>({
  fakePlans: async ({ fakeUserLoggedIn }, use) => {
    const randomMedics = await prisma.$queryRawUnsafe<Medicament[]>(
      `SELECT * FROM medicaments ORDER BY RAND() LIMIT ${faker.number.int({ max: 30, min: 1 })};`,
    );

    const fakeGeneratedPlans = faker.helpers.multiple(() => ({
      displayId: faker.number.int({ max: 99999 }),
      medicsOrder: randomMedics.map((medicament) => medicament.id),
      userId: fakeUserLoggedIn.id,
      data: Object.fromEntries(
        faker.helpers
          .arrayElements(randomMedics)
          .map((medicament) => [
            medicament.id,
            omitBy({} as PP.Plan.DataItem, isNil),
          ]),
      ),
      settings: {},
    }));

    const fakePlans = await prisma.$transaction(
      fakeGeneratedPlans.map((plan) => prisma.plan.create({ data: plan })),
    );

    use(fakePlans);

    await prisma.plan.deleteMany({
      where: {
        OR: fakePlans.map((plan) => ({ id: plan.id })),
      },
    });
  },
});
