"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authAction } from "@/app/_safe-actions/safe-actions";
import { savePlanDataSchema } from "@/app/(auth)/plan/validation";
import { getNewDisplayId } from "@/app/actions";
import { routes } from "@/app/routes-schema";
import { isCuid } from "@paralleldrive/cuid2";
import { z } from "zod";

import { MUTATION_SUCCESS, PLAN_NEW } from "@plan-prise/api/constants";
import type { Plan } from "@plan-prise/db-prisma";
import prisma from "@plan-prise/db-prisma";

/** MIGRATION */

export const migrateMedicsOrder = async (plan: Plan): Promise<PP.Plan.Data> => {
  "use server";

  let data = {};

  if (plan.medicsOrder) {
    data = Object.fromEntries(
      plan.medicsOrder.map((medicId) => [medicId, plan?.data?.[medicId] ?? {}]),
    );

    await prisma.plan.update({
      where: { id: plan.id },
      data: { medicsOrder: null },
    });
  } else {
    data = plan.data ?? {};
  }

  return data;
};

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
  async ({ query }) => {
    const results =
      query && query.length > 0
        ? await prisma.medicament.findMany({
            where: {
              denomination: {
                contains: query,
                mode: "insensitive",
              },
            },
            select: {
              id: true,
              denomination: true,
              principesActifs: true,
            },
          })
        : [];

    return results;
  },
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

export const savePlanDataAction = authAction(
  savePlanDataSchema,
  async ({ planId, data }, { userId }) => {
    if (planId === PLAN_NEW) {
      const displayId = await getNewDisplayId(userId);

      const plan = await prisma.plan.create({
        data: {
          displayId,
          data,
          userId,
        },
        select: { id: true, displayId: true },
      });

      return plan;
    } else {
      const plan = await prisma.plan.update({
        where: {
          id: planId,
          user: { id: userId },
        },
        data: {
          data: data,
        },
        select: { id: true, displayId: true },
      });

      return plan;
    }
  },
);

export const deletePlanAction = authAction(
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
