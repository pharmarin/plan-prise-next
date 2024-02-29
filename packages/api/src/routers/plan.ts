import type { RouterLike } from "@trpc/react-query/shared";
import { z } from "zod";

import { MUTATION_SUCCESS } from "../constants";
import { authProcedure, createTRPCRouter } from "../trpc";

const planRouter = createTRPCRouter({
  delete: authProcedure
    .input(z.string().cuid2())
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.plan.delete({
        where: {
          id: input,
          user: { id: ctx.session.user.id },
        },
      });

      return MUTATION_SUCCESS;
    }),
  getById: authProcedure.input(z.string().cuid2()).query(({ ctx, input }) =>
    ctx.prisma.plan.findUniqueOrThrow({
      where: {
        id: input,
        user: {
          id: ctx.session.user.id,
        },
      },
      include: {
        medics: {
          include: {
            commentaires: true,
            principesActifs: true,
          },
        },
      },
    }),
  ),
});

export type PlanRouterType = RouterLike<typeof planRouter>;

export default planRouter;
