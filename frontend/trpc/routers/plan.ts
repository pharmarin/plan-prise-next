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
        where: { id: input.planId, user: { id: ctx.user.id } },
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
        where: { id: input.planId, user: { id: ctx.user.id } },
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
  saveData: authProcedure
    .input(
      zod.object({
        planId: zod.string().cuid(),
        data: zod.record(
          zod.string().cuid(),
          zod.object({
            indication: zod.string().optional(),
            conservation: zod.string().optional(),
            posologies: zod
              .object({
                poso_matin: zod.string().optional(),
                poso_10h: zod.string().optional(),
                poso_midi: zod.string().optional(),
                poso_16h: zod.string().optional(),
                poso_18h: zod.string().optional(),
                poso_soir: zod.string().optional(),
                poso_coucher: zod.string().optional(),
              })
              .optional(),
            commentaires: zod
              .record(
                zod.string().cuid(),
                zod
                  .object({
                    texte: zod.string().optional(),
                    checked: zod.boolean().optional(),
                  })
                  .optional(),
              )
              .optional(),
            custom_commentaires: zod
              .record(
                zod.string().cuid2(),
                zod.object({ texte: zod.string().optional() }).optional(),
              )
              .optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.plan.update({
        where: {
          id: input.planId,
          user: { id: ctx.user.id },
        },
        data: {
          data: input.data,
        },
      });

      return MUTATION_SUCCESS;
    }),
});

export type PlanRouterType = RouterLike<typeof planRouter>;

export default planRouter;
