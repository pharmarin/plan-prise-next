import { notFound } from "next/navigation";
import CalendarClient from "@/app/(auth)/calendrier/[calendarId]/client";
import { routes } from "@/app/routes-schema";
import { Navigation } from "@/app/state-navigation";

import { getServerSession } from "@plan-prise/auth/get-session";
import prisma from "@plan-prise/db-prisma";

const Calendar = async ({ params }: { params: unknown }) => {
  try {
    const session = await getServerSession();
    const { calendarId } = routes.calendar.$parseParams(params);

    const calendar = await prisma.calendar.findFirstOrThrow({
      where: { displayId: calendarId, user: { id: session?.user.id } },
    });

    return (
      <div>
        <Navigation
          title={`Calendrier n°${calendar.displayId}`}
          returnTo={routes.calendars()}
        />
        <CalendarClient calendar={calendar} />
        <p className="font-mono">{JSON.stringify(calendar)}</p>
      </div>
    );
  } catch (e) {
    notFound();
  }
};

export default Calendar;
