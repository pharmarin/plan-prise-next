"use server";

import { revalidatePath } from "next/cache";
import { adminAction } from "@/app/_safe-actions/safe-actions";
import { upsertPrincipeActifSchema } from "@/app/(auth)/admin/principes-actifs/validation";
import { routes } from "@/app/routes-schema";
import { z } from "zod";

import prisma from "@plan-prise/db-prisma";

export const upsertPrincipeActifAction = adminAction
  .schema(upsertPrincipeActifSchema)
  .action(async ({ parsedInput: { id, ...input } }) => {
    await prisma.principeActif.upsert({
      where: { id },
      create: input,
      update: input,
    });

    revalidatePath(routes.principesActifs());
  });

export const deletePrincipeActifAction = adminAction
  .schema(z.object({ principeActifId: z.string().cuid2() }))
  .action(async ({ parsedInput: { principeActifId } }) => {
    await prisma.principeActif.delete({
      where: { id: principeActifId },
    });

    revalidatePath(routes.principesActifs());
  });
