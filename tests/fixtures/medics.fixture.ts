import { faker } from "@faker-js/faker";

import prisma, {
  Commentaire,
  Medicament,
  PrincipeActif,
  VoieAdministration,
} from "@plan-prise/db-prisma";
import { MedicsPage } from "@plan-prise/tests/pages/auth/medics.page";

import { authTest } from "./auth.fixture";

type FakeMedic = Omit<
  Medicament,
  | "id"
  | "precaution_old"
  | "conservationDuree"
  | "medics_simpleId"
  | "precautionId"
  | "createdAt"
  | "updatedAt"
> & {
  conservationDuree?: { duree: string; laboratoire?: string }[];
  commentaires: { create: Omit<Commentaire, "id" | "medicamentId">[] };
  principesActifs: { create: Omit<PrincipeActif, "id" | "medicamentId">[] };
};

type MedicsFixture = {
  fakeMedic: PP.Medicament.Include;
};

const fakeMedicBase = (): FakeMedic => ({
  denomination: faker.commerce.productName(),
  indications: Array(faker.number.int({ min: 1, max: 5 })).map(() =>
    faker.word.verb(),
  ),
  conservationFrigo: faker.datatype.boolean(),
  conservationDuree: faker.datatype.boolean()
    ? Array(faker.number.int({ min: 1, max: 5 })).map(() => ({
        duree: faker.word.words(),
        laboratoire: faker.datatype.boolean()
          ? faker.company.name()
          : undefined,
      }))
    : undefined,
  voiesAdministration: Array(faker.number.int({ min: 1, max: 3 }))
    .map(() => faker.helpers.enumValue(VoieAdministration))
    .filter((value): value is VoieAdministration => value !== undefined),
  commentaires: {
    create: Array(faker.number.int({ min: 1, max: 10 })).map(() => ({
      population: faker.datatype.boolean() ? faker.word.words() : null,
      texte: faker.word.words(),
      voieAdministration: faker.datatype.boolean()
        ? faker.helpers.enumValue(VoieAdministration)
        : null,
    })),
  },
  principesActifs: {
    create: Array(faker.number.int({ min: 1, max: 10 })).map(() => ({
      denomination: faker.word.noun(),
    })),
  },
});

export const test = authTest.extend<MedicsFixture>({
  forgotPasswordPage: async ({ page }, use) => {
    const forgotPasswordPage = new MedicsPage(page);
    /* await forgotPasswordPage.goto();
    await use(forgotPasswordPage); */
  },
  fakeMedic: async ({ page: _ }, use) => {
    const medicBase = fakeMedicBase();

    const fakeMedic = await prisma.medicament.create({
      data: medicBase,
      include: { commentaires: true, principesActifs: true },
    });

    await use(fakeMedic);

    await prisma.principeActif.deleteMany({
      where: {
        OR: fakeMedic.principesActifs.map((principeActif) => ({
          id: principeActif.id,
        })),
      },
    });
    await prisma.commentaire.deleteMany({
      where: {
        OR: fakeMedic.commentaires.map((commentaire) => ({
          id: commentaire.id,
        })),
      },
    });
    await prisma.medicament.delete({ where: { id: fakeMedic.id } });
  },
});
