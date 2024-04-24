import { faker } from "@faker-js/faker";

import type { Medicament, Plan, Prisma } from "@plan-prise/db-prisma";
import prisma from "@plan-prise/db-prisma";

import { authTest } from "./auth.fixture";

type PlanFixture = {
  fakePlan: Plan & { data: PP.Plan.Data1 };
  fakePlans: (Plan & { data: PP.Plan.Data1 })[];
};

const getRandomMedics = async () =>
  await prisma.$queryRawUnsafe<Medicament[]>(
    `SELECT * FROM medicaments ORDER BY RANDOM() LIMIT ${faker.number.int({ max: 30, min: 1 })};`,
  );

export const getFakePlan = (
  randomMedics: Medicament[],
  userId: string,
): Prisma.PlanCreateInput => ({
  displayId: faker.number.int({ max: 99999 }),
  user: { connect: { id: userId } },
  data: randomMedics.map((medicament) => ({
    medicId: medicament.id,
    data: {},
  })),
  settings: {},
});

export const planTest = authTest.extend<PlanFixture>({
  fakePlan: async ({ fakeUserLoggedIn }, use) => {
    const randomMedics = await getRandomMedics();

    const fakeGeneratedPlan = getFakePlan(randomMedics, fakeUserLoggedIn.id);

    const fakePlan = await prisma.plan.create({
      data: fakeGeneratedPlan,
    });

    await use(fakePlan as Plan & { data: PP.Plan.Data1 });

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

    await use(fakePlans as (Plan & { data: PP.Plan.Data1 })[]);

    await prisma.plan.deleteMany({
      where: {
        OR: fakePlans.map((plan) => ({ id: plan.id })),
      },
    });
  },
});
