"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authAction } from "@/app/_safe-actions/safe-actions";
import { routes } from "@/app/routes-schema";
import { z } from "zod";

import { CALENDAR_NEW, MUTATION_SUCCESS } from "@plan-prise/api/constants";
import prisma from "@plan-prise/db-prisma";

const getNewDisplayId = async (userId: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      maxId: { increment: 1 },
    },
    select: { maxId: true },
  });

  return user.maxId;
};

export const saveDataAction = authAction(
  z.object({
    calendarId: z.union([z.literal(CALENDAR_NEW), z.string().cuid2()]),
    data: z.record(
      z.string(),
      z.array(
        z.object({
          startDate: z.string(),
          endDate: z.string(),
          quantity: z.coerce.string().optional(),
          frequency: z.coerce.number().optional(),
        }),
      ),
    ),
  }),
  async ({ calendarId, data }, { userId }) => {
    if (calendarId === CALENDAR_NEW) {
      const displayId = await getNewDisplayId(userId);

      const calendar = await prisma.calendar.create({
        data: {
          displayId,
          data,
          userId,
        },
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
