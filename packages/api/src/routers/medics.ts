import { isCuid } from "@paralleldrive/cuid2";
import { z } from "zod";

import prisma from "@plan-prise/db-prisma";

import { adminProcedure, authProcedure, createTRPCRouter } from "../trpc";

const medicsRouter = createTRPCRouter({
  unique: authProcedure.input(z.string().cuid2()).query(({ input }) =>
    prisma.medicament.findUniqueOrThrow({
      where: { id: input },
      include: { commentaires: true, principesActifs: true },
    }),
  ),
  findAll: authProcedure
    .input(
      z.object({
        fields: z.array(
          z
            .string()
            .refine((field) =>
              Object.keys(prisma.medicament.fields).includes(field),
            ),
        ),
        value: z.string(),
      }),
    )
    .query(({ input }) =>
      input.value && input.value.length > 0
        ? prisma.medicament.findMany({
            where: {
              OR: input.fields.map((field) => ({
                [field]: { contains: input.value },
              })),
            },
            select: {
              id: true,
              denomination: true,
              principesActifs: true,
            },
          })
        : [],
    ),
  findPrecautionsByMedicId: authProcedure
    .input(z.array(z.string()).optional())
    .query(({ ctx, input }) => {
      if (!input) {
        return [];
      }

      return ctx.prisma.precaution.findMany({
        where: {
          medicaments: {
            some: {
              OR: input.filter((id) => isCuid(id)).map((id) => ({ id })),
            },
          },
        },
      });
    }),
  findComment: adminProcedure
    .input(z.object({ commentaireId: z.string().cuid2() }))
    .query(({ ctx, input }) =>
      ctx.prisma.commentaire.findFirstOrThrow({
        where: { id: input.commentaireId },
      }),
    ),
});

export default medicsRouter;
