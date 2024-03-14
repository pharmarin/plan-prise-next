"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authAction } from "@/app/_safe-actions/safe-actions";
import { routes } from "@/app/routes-schema";
import { isCuid } from "@paralleldrive/cuid2";
import { z } from "zod";

import { MUTATION_SUCCESS, PLAN_NEW } from "@plan-prise/api/constants";
import type { Plan } from "@plan-prise/db-prisma";
import prisma from "@plan-prise/db-prisma";
import PP_Error from "@plan-prise/errors";

/**
 * QUERIES
 */

export const findMedicAction = authAction(
  z.object({
    medicId: z.string().cuid2(),
  }),
  ({ medicId }) =>
    prisma.medicament.findUniqueOrThrow({
      where: { id: medicId },
      include: { commentaires: true, principesActifs: true },
    }),
);

export const findManyMedicsAction = authAction(
  z.object({
    query: z.string(),
  }),
  async ({ query }) =>
    query && query.length > 0
      ? prisma.medicament.findMany({
          where: {
            denomination: {
              contains: query,
            },
          },
          select: {
            id: true,
            denomination: true,
            principesActifs: true,
          },
        })
      : [],
);

export const findPrecautionsAction = authAction(
  z.object({ query: z.array(z.string()).optional() }),
  async ({ query }) => {
    if (!query) {
      return [];
    }

    return prisma.precaution.findMany({
      where: {
        medicaments: {
          some: {
            OR: query.filter((id) => isCuid(id)).map((id) => ({ id })),
          },
        },
      },
    });
  },
);

/**
 * MUTATIONS
 */

const addMedic = (medicId: string, medicsOrder: Plan["medicsOrder"]) => {
  if (isCuid(medicId)) {
    return {
      medics: { connect: { id: medicId } },
      medicsOrder: [
        ...(Array.isArray(medicsOrder) ? medicsOrder : []),
        medicId,
      ],
    };
  } else {
    return {
      medicsOrder: [
        ...(Array.isArray(medicsOrder) ? medicsOrder : []),
        medicId,
      ],
    };
  }
};

export const addMedicAction = authAction(
  z.object({
    planId: z.string().cuid2().or(z.literal(PLAN_NEW)),
    medicId: z.string(),
  }),
  async ({ medicId, planId }, { userId }) => {
    if (planId === PLAN_NEW) {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          maxId: { increment: 1 },
        },
        select: { maxId: true },
      });

      const plan = await prisma.plan.create({
        data: {
          displayId: user.maxId,
          ...addMedic(medicId, []),
          user: {
            connect: {
              id: userId,
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
      const plan = await prisma.plan.findUniqueOrThrow({
        where: { id: planId },
      });

      if (
        Array.isArray(plan.medicsOrder) &&
        plan.medicsOrder.includes(medicId)
      ) {
        throw new PP_Error("PLAN_MEDICAMENT_ALREADY_ADDED_ERROR");
      }

      await prisma.plan.update({
        where: { id: planId, user: { id: userId } },
        data: addMedic(medicId, plan.medicsOrder),
      });

      return MUTATION_SUCCESS;
    }
  },
);

export const removeMedicAction = authAction(
  z.object({ planId: z.string().cuid2(), medicId: z.string() }),
  async ({ medicId, planId }, { userId }) => {
    const plan = await prisma.plan.findUniqueOrThrow({
      where: { id: planId, user: { id: userId } },
      include: { medics: true },
    });

    await prisma.plan.update({
      where: { id: planId },
      data: {
        medics: isCuid(medicId) ? { disconnect: { id: medicId } } : undefined,
        medicsOrder: Array.isArray(plan.medicsOrder)
          ? plan.medicsOrder.filter((id) => id !== medicId)
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
  },
);

export const saveDataAction = authAction(
  z.object({
    planId: z.string().cuid2(),
    data: z.record(
      z.string(),
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
  async ({ planId, data }, { userId }) => {
    await prisma.plan.update({
      where: {
        id: planId,
        user: { id: userId },
      },
      data: {
        data: data,
      },
    });

    return MUTATION_SUCCESS;
  },
);

export const deleteAction = authAction(
  z.object({ planId: z.string().cuid2() }),
  async ({ planId }, { userId }) => {
    await prisma.plan.delete({
      where: {
        id: planId,
        user: { id: userId },
      },
    });

    revalidatePath(routes.plans());
    redirect(routes.plans());
  },
);

const planSettingsSchema = z.object({
  posos: z.object({
    poso_lever: z.boolean().optional().default(false),
    poso_matin: z.boolean().optional().default(true),
    poso_10h: z.boolean().optional().default(false),
    poso_midi: z.boolean().optional().default(true),
    poso_16h: z.boolean().optional().default(false),
    poso_18h: z.boolean().optional().default(false),
    poso_soir: z.boolean().optional().default(true),
    poso_coucher: z.boolean().optional().default(true),
  }),
});

export const saveSettingsAction = authAction(
  z.object({ planId: z.string().cuid2(), settings: planSettingsSchema }),
  async ({ planId, settings }, { userId }) => {
    await prisma.plan.update({
      where: { id: planId, user: { id: userId } },
      data: { settings },
    });

    return MUTATION_SUCCESS;
  },
);
