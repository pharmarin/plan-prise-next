import { useMemo } from "react";
import CalendarClient from "@/app/(auth)/calendrier/[calendarId]/client";
import { routes } from "@/app/routes-schema";
import { Navigation } from "@/app/state-navigation";
import type { Calendar } from "@prisma/client";

import { CALENDAR_NEW } from "@plan-prise/api/constants";

const CalendarNewPage = () => {
  const calendar = useMemo(
    (): Calendar => ({
      id: CALENDAR_NEW,
      displayId: -1,
      data: {},
      userId: "",
      createdAt: new Date(),
      updatedAt: null,
    }),
    [],
  );

  return (
    <>
      <Navigation title="Nouveau calendrier" returnTo={routes.calendars()} />
      <CalendarClient calendar={calendar} />
    </>
  );
};

export default CalendarNewPage;
