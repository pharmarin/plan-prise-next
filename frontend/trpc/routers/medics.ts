import prisma from "@/prisma";
import { authProcedure, router } from "@/trpc/trpc";
import { z } from "zod";

const medicsRouter = router({
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
    .input(z.array(z.string().cuid2()).optional())
    .query(({ ctx, input }) => {
      if (!input) {
        return [];
      }

      return ctx.prisma.precaution.findMany({
        where: {
          medicaments: {
            some: {
              OR: input.map((id) => ({ id })),
            },
          },
        },
      });
    }),
});

export default medicsRouter;
