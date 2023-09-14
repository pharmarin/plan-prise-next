import { authProcedure, router } from "@/trpc/trpc";
import type { RouterLike } from "@trpc/react-query/shared";
import { isEqual, sortBy } from "lodash";
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

      let medicsOrder: string[] = Array.isArray(plan.medicsOrder)
        ? (plan.medicsOrder as string[])
        : [];
      const medicsId = plan.medics.map((medic) => medic.id);

      if (isEqual(sortBy(medicsOrder), sortBy(medicsId))) {
        medicsOrder = medicsId;
      }

      medicsOrder.push(input.medicId);

      return ctx.prisma.plan.update({
        where: { id: input.planId },
        data: {
          medics: { connect: { id: input.medicId } },
          medicsOrder,
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

      const medicsOrder: string[] = Array.isArray(plan.medicsOrder)
        ? (plan.medicsOrder as string[]).filter((id) => id !== input.medicId)
        : [];

      return ctx.prisma.plan.update({
        where: { id: input.planId },
        data: {
          medics: { disconnect: { id: input.medicId } },
          medicsOrder,
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
    }),
});

export type PlanRouterType = RouterLike<typeof planRouter>;

export default planRouter;
