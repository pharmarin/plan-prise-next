import { faker } from "@faker-js/faker";

import type { Medicament, Plan, Prisma } from "@plan-prise/db-prisma";
import prisma from "@plan-prise/db-prisma";

import { authTest } from "./auth.fixture";

type PlanFixture = {
  fakePlan: Plan;
  fakePlans: Plan[];
};

const getRandomMedics = async () =>
  await prisma.$queryRawUnsafe<Medicament[]>(
    `SELECT * FROM medicaments ORDER BY RAND() LIMIT ${faker.number.int({ max: 30, min: 1 })};`,
  );

export const getFakePlan = (
  randomMedics: Medicament[],
  userId: string,
): Prisma.PlanCreateInput => ({
  displayId: faker.number.int({ max: 99999 }),
  medicsOrder: randomMedics.map((medicament) => medicament.id),
  user: { connect: { id: userId } },
  data: {},
  settings: {},
});

export const planTest = authTest.extend<PlanFixture>({
  fakePlan: async ({ fakeUserLoggedIn }, use) => {
    const randomMedics = await getRandomMedics();

    const fakeGeneratedPlan = getFakePlan(randomMedics, fakeUserLoggedIn.id);

    const fakePlan = await prisma.plan.create({
      data: fakeGeneratedPlan,
    });

    await use(fakePlan);

    await prisma.plan.delete({
      where: {
        id: fakePlan.id,
      },
    });
  },
  fakePlans: async ({ fakeUserLoggedIn }, use) => {
    const randomMedics = await getRandomMedics();

    const fakeGeneratedPlans = faker.helpers.multiple(() =>
      getFakePlan(randomMedics, fakeUserLoggedIn.id),
    );

    const fakePlans = await prisma.$transaction(
      fakeGeneratedPlans.map((plan) => prisma.plan.create({ data: plan })),
    );

    await use(fakePlans);

    await prisma.plan.deleteMany({
      where: {
        OR: fakePlans.map((plan) => ({ id: plan.id })),
      },
    });
  },
});
