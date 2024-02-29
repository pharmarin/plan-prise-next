"use server";

import { authAction } from "@/app/_safe-actions/safe-actions";
import { z } from "zod";

import prisma from "@plan-prise/db-prisma";

export const getMedicAction = authAction(
  z.object({
    medicId: z.string().cuid2(),
  }),
  ({ medicId }) =>
    prisma.medicament.findUniqueOrThrow({
      where: { id: medicId },
      include: { commentaires: true, principesActifs: true },
    }),
);
