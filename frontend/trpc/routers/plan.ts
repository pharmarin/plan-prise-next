import { PLAN_NEW } from "@/app/(auth)/plan/_lib/constants";
import { MUTATION_SUCCESS } from "@/trpc/responses";
import { authProcedure, router } from "@/trpc/trpc";
import type { Plan } from "@prisma/client";
import type { RouterLike } from "@trpc/react-query/shared";
import { z } from "zod";

const addMedic = (medicId: string, medicsOrder: Plan["medicsOrder"]) => ({
  medics: { connect: { id: medicId } },
  medicsOrder: [...(Array.isArray(medicsOrder) ? medicsOrder : []), medicId],
});

const planRouter = router({
  addMedic: authProcedure
    .input(
      z.object({
        planId: z.string().cuid2().or(z.literal(PLAN_NEW)),
        medicId: z.string().cuid2(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.planId === PLAN_NEW) {
        const user = await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            maxId: { increment: 1 },
          },
          select: { maxId: true },
        });

        const plan = await ctx.prisma.plan.create({
          data: {
            displayId: user.maxId,
            ...addMedic(input.medicId, []),
            user: {
              connect: {
                id: ctx.user.id,
              },
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
        });

        return plan;
      } else {
        const plan = await ctx.prisma.plan.findUniqueOrThrow({
          where: { id: input.planId },
        });

        await ctx.prisma.plan.update({
          where: { id: input.planId, user: { id: ctx.user.id } },
          data: addMedic(input.medicId, plan.medicsOrder),
        });

        return MUTATION_SUCCESS;
      }
    }),
  delete: authProcedure
    .input(z.string().cuid2())
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.plan.delete({
        where: {
          id: input,
          user: { id: ctx.user.id },
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
          medicsOrder: Array.isArray(plan.medicsOrder)
            ? plan.medicsOrder.filter((id) => id !== input.medicId)
            : [],
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
