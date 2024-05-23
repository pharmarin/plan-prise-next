import { routes } from "@/app/routes-schema";
import { Navigation } from "@/app/state-navigation";

import { getServerSession } from "@plan-prise/auth/get-session";
import prisma from "@plan-prise/db-prisma";
import ModuleIndex from "@plan-prise/ui/components/module-index";

const CalendarsIndex = async () => {
  const session = await getServerSession();

  const calendars = await prisma.calendar.findMany({
    where: {
      user: { id: session?.user.id },
    },
    select: { displayId: true },
    orderBy: { displayId: "asc" },
  });

  return (
    <>
      <Navigation title="Vos calendriers de prise" />
      <ModuleIndex
        itemRoute={(item) => routes.calendar({ calendarId: item })}
        items={calendars.map((calendar) => calendar.displayId)}
        newRoute={routes.calendarCreate()}
        testId={{ tile: "calendar-index-tile" }}
      />
    </>
  );
};
export default CalendarsIndex;
