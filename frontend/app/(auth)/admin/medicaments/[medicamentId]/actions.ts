"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminAction } from "@/app/_safe-actions/safe-actions";
import {
  upsertCommentaireSchema,
  upsertMedicSchema,
} from "@/app/(auth)/admin/medicaments/[medicamentId]/validation";
import { routes } from "@/app/routes-schema";
import { z } from "zod";

import type { Prisma } from "@plan-prise/db-prisma";
import prisma from "@plan-prise/db-prisma";

export const findManyPrincipesActifsAction = adminAction(
  z.object({
    query: z.string(),
  }),
  async ({ query }) => {
    if (query.length < 4) return undefined;

    return await prisma.principeActif.findMany({
      where: {
        denomination: {
          contains: query,
        },
      },
      take: 10,
    });
  },
);

export const upsertMedicAction = adminAction(
  upsertMedicSchema,
  async (input) => {
    const {
      id,
      conservationDuree,
      conservationFrigo,
      denomination,
      indications,
      voiesAdministration,
      principesActifs,
      commentaires,
    } = input;

    const data:
      | Prisma.MedicamentUpsertArgs["update"]
      | Prisma.MedicamentUpsertArgs["create"] = {
      denomination,
      indications: indications.map((indication) => indication.value),
      voiesAdministration,
      conservationFrigo,
      conservationDuree,
      principesActifs: {
        connect: principesActifs.map((principeActif) => ({
          id: principeActif.id,
        })),
      },
      commentaires: {
        connect: commentaires.map((commment) => ({
          id: commment.commentaireId,
        })),
      },
    };

    const medicament = await prisma.medicament.upsert({
      where: { id },
      create: data as Prisma.MedicamentUpsertArgs["create"],
      update: data,
    });

    revalidatePath(routes.medicaments());

    return medicament;
  },
);

export const deleteMedicAction = adminAction(
  z.object({ medicId: z.string().cuid2() }),
  async ({ medicId }) => {
    await prisma.medicament.delete({ where: { id: medicId } });
    revalidatePath(routes.medicaments());
    redirect(routes.medicaments());
  },
);

export const upsertCommentaireAction = adminAction(
  upsertCommentaireSchema,
  async ({ id, medicId, ...input }) => {
    const commentaire = await prisma.commentaire.upsert({
      where: {
        id,
      },
      update: input,
      create: input,
    });

    if (medicId) {
      await prisma.medicament.update({
        where: { id: medicId },
        data: {
          commentaires: {
            connect: { id: commentaire.id },
          },
        },
      });
    }

    return commentaire;
  },
);

export const deleteCommentaireAction = adminAction(
  z.object({ commentaireId: z.string().cuid2() }),
  ({ commentaireId }) =>
    prisma.commentaire.delete({
      where: { id: commentaireId },
    }),
);
