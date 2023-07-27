import prisma from "@/prisma";
import { authProcedure, router } from "@/trpc/trpc";
import { medicId } from "@/validation/medics";

const medicsRouter = router({
  unique: authProcedure
    .input(medicId)
    .query(({ input }) =>
      prisma.medicament.findUniqueOrThrow({
        where: { id: input },
        include: {commentaires: true, principesActifs: true },
      })
    ),
});

export default medicsRouter;
