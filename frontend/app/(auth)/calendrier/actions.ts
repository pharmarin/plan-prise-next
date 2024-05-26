"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authAction } from "@/app/_safe-actions/safe-actions";
import { getNewDisplayId } from "@/app/actions";
import { routes } from "@/app/routes-schema";
import { z } from "zod";

import { MUTATION_SUCCESS, NEW } from "@plan-prise/api/constants";
import prisma from "@plan-prise/db-prisma";

export const saveDataAction = authAction(
  z.object({
    calendarId: z.union([z.literal(NEW), z.string().cuid2()]),
    data: z.array(
      z.object({
        medicId: z.string(),
        data: z.array(
          z.object({
            startDate: z.string(),
            endDate: z.string(),
            quantity: z.coerce.string().optional(),
            frequency: z.coerce.number().optional(),
          }),
        ),
      }),
    ),
  }),
  async ({ calendarId, data }, { userId }) => {
    if (calendarId === NEW) {
      const displayId = await getNewDisplayId(userId);

      const calendar = await prisma.calendar.create({
        data: {
          displayId,
          data,
          userId,
        },
        select: { id: true, displayId: true },
      });

      return calendar;
    } else {
      await prisma.calendar.update({
        where: {
          id: calendarId,
          user: { id: userId },
        },
        data: {
          data: data,
        },
        select: { id: true, displayId: true },
      });

      return MUTATION_SUCCESS;
    }
  },
);

export const deleteCalendarAction = authAction(
  z.object({ calendarId: z.string().cuid2() }),
  async ({ calendarId }, { userId }) => {
    await prisma.calendar.delete({
      where: {
        id: calendarId,
        user: { id: userId },
      },
    });

    revalidatePath(routes.calendars());
    redirect(routes.calendars());
  },
);
