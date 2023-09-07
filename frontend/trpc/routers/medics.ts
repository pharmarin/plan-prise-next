import prisma from "@/prisma";
import { authProcedure, router } from "@/trpc/trpc";
import { findAllValidation, medicId } from "@/validation/medics";

const medicsRouter = router({
  unique: authProcedure.input(medicId).query(({ input }) =>
    prisma.medicament.findUniqueOrThrow({
      where: { id: input },
      include: { commentaires: true, principesActifs: true },
    }),
  ),
  findAll: authProcedure.input(findAllValidation).query(({ input }) =>
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
});

export default medicsRouter;
