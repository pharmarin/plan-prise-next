import { isCuid } from "@paralleldrive/cuid2";
import { z } from "zod";

import { adminProcedure, authProcedure, createTRPCRouter } from "../trpc";

const medicsRouter = createTRPCRouter({
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
