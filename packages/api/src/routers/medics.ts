import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "../trpc";

const medicsRouter = createTRPCRouter({
  findComment: adminProcedure
    .input(z.object({ commentaireId: z.string().cuid2() }))
    .query(({ ctx, input }) =>
      ctx.prisma.commentaire.findFirstOrThrow({
        where: { id: input.commentaireId },
      }),
    ),
});

export default medicsRouter;
