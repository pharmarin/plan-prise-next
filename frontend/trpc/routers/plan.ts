import { MUTATION_SUCCESS } from "@/trpc/responses";
import { authProcedure, router } from "@/trpc/trpc";
import type { RouterLike } from "@trpc/react-query/shared";
import { z } from "zod";

const planRouter = router({
  addMedic: authProcedure
    .input(
      z.object({
        planId: z.string().cuid2(),
        medicId: z.string().cuid2(),
        //custom: z.string().optional(),
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
      z.object({ planId: z.string().cuid2(), medicId: z.string().cuid2() }),
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
      z.object({
        planId: z.string().cuid2(),
        data: z.record(
          z.string().cuid2(),
          z.object({
            indication: z.string().optional(),
            conservation: z.string().optional(),
            posologies: z
              .object({
                poso_matin: z.string().optional(),
                poso_10h: z.string().optional(),
                poso_midi: z.string().optional(),
                poso_16h: z.string().optional(),
                poso_18h: z.string().optional(),
                poso_soir: z.string().optional(),
                poso_coucher: z.string().optional(),
              })
              .optional(),
            commentaires: z
              .record(
                z.string().cuid2(),
                z
                  .object({
                    texte: z.string().optional(),
                    checked: z.boolean().optional(),
                  })
                  .optional(),
              )
              .optional(),
            custom_commentaires: z
              .record(
                z.string().cuid2(),
                z.object({ texte: z.string().optional() }).optional(),
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
