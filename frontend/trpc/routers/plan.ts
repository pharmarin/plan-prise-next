import { MUTATION_SUCCESS } from "@/trpc/responses";
import { authProcedure, router } from "@/trpc/trpc";
import type { RouterLike } from "@trpc/react-query/shared";
import * as zod from "zod";

const planRouter = router({
  addMedic: authProcedure
    .input(
      zod.object({
        planId: zod.string().cuid(),
        medicId: zod.string().cuid(),
        //custom: zod.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const plan = await ctx.prisma.plan.findUniqueOrThrow({
        where: { id: input.planId },
        include: { medics: true },
      });

      await ctx.prisma.plan.update({
        where: { id: input.planId },
        data: {
          medics: { connect: { id: input.medicId } },
          medicsOrder: [...plan.medicsIdSorted, input.medicId],
        },
        include: {
          medics: {
            include: {
              commentaires: true,
              principesActifs: true,
            },
          },
        },
      });

      return MUTATION_SUCCESS;
    }),
  removeMedic: authProcedure
    .input(
      zod.object({ planId: zod.string().cuid(), medicId: zod.string().cuid() }),
    )
    .mutation(async ({ input, ctx }) => {
      const plan = await ctx.prisma.plan.findUniqueOrThrow({
        where: { id: input.planId },
        include: { medics: true },
      });

      await ctx.prisma.plan.update({
        where: { id: input.planId },
        data: {
          medics: { disconnect: { id: input.medicId } },
          medicsOrder: plan.medicsIdSorted.filter((id) => id !== input.medicId),
        },
        include: {
          medics: {
            include: {
              commentaires: true,
              principesActifs: true,
            },
          },
        },
      });

      return MUTATION_SUCCESS;
    }),
});

export type PlanRouterType = RouterLike<typeof planRouter>;

export default planRouter;
