"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authAction } from "@/app/_safe-actions/safe-actions";
import { routes } from "@/app/routes-schema";
import { z } from "zod";

import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import prisma from "@plan-prise/db-prisma";

export const saveDataAction = authAction(
  z.object({
    calendarId: z.string().cuid2(),
    data: z.record(
      z.string(),
      z.array(
        z.object({
          startDate: z.string(),
          endDate: z.string(),
          quantity: z.number().optional(),
          frequency: z.number().optional(),
        }),
      ),
    ),
  }),
  async ({ calendarId, data }, { userId }) => {
    await prisma.calendar.update({
      where: {
        id: calendarId,
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
  z.object({ calendarId: z.string().cuid2() }),
  async ({ calendarId }, { userId }) => {
    await prisma.calendar.delete({
      where: {
        id: calendarId,
        user: { id: userId },
      },
    });

    revalidatePath(routes.calendars());
    redirect(routes.plans());
  },
);
