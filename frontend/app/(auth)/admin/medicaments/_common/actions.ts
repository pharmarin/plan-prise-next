"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  upsertCommentaireSchema,
  upsertMedicSchema,
} from "@/app/(auth)/admin/medicaments/_common/validation";
import { routes } from "@/app/routes-schema";
import { adminAction } from "@/app/safe-actions";
import { z } from "zod";

import type { Prisma } from "@plan-prise/db-prisma";
import prisma from "@plan-prise/db-prisma";

export const findManyPrincipesActifsAction = adminAction
  .schema(
    z.object({
      query: z.string(),
    }),
  )
  .action(async ({ parsedInput: { query } }) => {
    if (query.length < 4) return undefined;

    return await prisma.principeActif.findMany({
      where: {
        denomination: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 10,
    });
  });

export const upsertMedicAction = adminAction
  .schema(upsertMedicSchema)
  .action(async ({ parsedInput }) => {
    const {
      id,
      conservationDuree,
      conservationFrigo,
      denomination,
      indications,
      voiesAdministration,
      principesActifs,
      commentaires,
    } = parsedInput;

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
      // id === undefined if new medic
      where: { id: id ?? "" },
      create: data as Prisma.MedicamentUpsertArgs["create"],
      update: data,
    });

    revalidatePath(routes.medicaments());

    return medicament;
  });

export const deleteMedicAction = adminAction
  .schema(z.object({ medicId: z.string().cuid2() }))
  .action(async ({ parsedInput: { medicId } }) => {
    await prisma.medicament.delete({ where: { id: medicId } });
    revalidatePath(routes.medicaments());
    redirect(routes.medicaments());
  });

export const upsertCommentaireAction = adminAction
  .schema(upsertCommentaireSchema)
  .action(async ({ parsedInput: { id, medicId, ...input } }) => {
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
  });

export const deleteCommentaireAction = adminAction
  .schema(z.object({ commentaireId: z.string().cuid2() }))
  .action(({ parsedInput: { commentaireId } }) =>
    prisma.commentaire.delete({
      where: { id: commentaireId },
    }),
  );
