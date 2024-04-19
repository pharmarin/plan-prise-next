"use server";

import { authAction } from "@/app/_safe-actions/safe-actions";
import { z } from "zod";

import prisma from "@plan-prise/db-prisma";

export const findMedicAction = authAction(
  z.object({
    medicId: z.string().cuid2(),
  }),
  ({ medicId }) =>
    prisma.medicament.findUniqueOrThrow({
      where: { id: medicId },
      include: { commentaires: true, principesActifs: true },
    }),
);

export const findManyMedicsAction = authAction(
  z.object({
    query: z.string(),
  }),
  async ({ query }) => {
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
  },
);
