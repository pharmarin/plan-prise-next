import { notFound } from "next/navigation";
import CalendarClient from "@/app/(auth)/calendrier/[calendarId]/client";
import { routes } from "@/app/routes-schema";
import { Navigation } from "@/app/state-navigation";
import { isCuid } from "@paralleldrive/cuid2";

import { getServerSession } from "@plan-prise/auth/get-session";
import prisma from "@plan-prise/db-prisma";

const Calendar = async ({ params }: { params: unknown }) => {
  try {
    const session = await getServerSession();
    const { calendarId } = routes.calendar.$parseParams(params);

    const calendar = await prisma.calendar.findFirstOrThrow({
      where: { displayId: calendarId, user: { id: session?.user.id } },
    });

    const medicamentIdArray = Object.keys(calendar.data ?? {})
      .map((medicId) => (isCuid(medicId) ? medicId : undefined))
      .filter((medicId): medicId is string => Boolean(medicId));
    const medicaments =
      medicamentIdArray.length > 0
        ? await prisma.medicament.findMany({
            where: {
              OR: Object.keys(calendar.data ?? {}).map((medicId) => ({
                id: medicId,
              })),
            },
            include: { principesActifs: true },
          })
        : undefined;

    return (
      <div>
        <Navigation
          title={`Calendrier n°${calendar.displayId}`}
          returnTo={routes.calendars()}
        />
        <CalendarClient calendar={calendar} medicaments={medicaments} />
      </div>
    );
  } catch (e) {
    notFound();
  }
};

export default Calendar;
