"use server";

import { authAction } from "@/app/safe-actions";
import { z } from "zod";

import prisma from "@plan-prise/db-prisma";

export const getNewDisplayId = async (userId: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      maxId: { increment: 1 },
    },
    select: { maxId: true },
  });

  return user.maxId;
};

export const findMedicAction = authAction
  .schema(
    z.object({
      medicId: z.string().cuid2(),
    }),
  )
  .action(({ parsedInput: { medicId } }) =>
    prisma.medicament.findUniqueOrThrow({
      where: { id: medicId },
      include: { commentaires: true, principesActifs: true },
    }),
  );

export const findManyMedicsAction = authAction
  .schema(
    z.object({
      query: z.string(),
    }),
  )
  .action(async ({ parsedInput: { query } }) => {
    const results =
      query && query.length > 0
        ? await prisma.medicament.findMany({
            where: {
              denomination: {
                startsWith: query,
                mode: "insensitive",
              },
            },
            select: {
              id: true,
              denomination: true,
              principesActifs: true,
            },
            orderBy: {
              denomination: "asc",
            },
          })
        : [];

    return results;
  });
