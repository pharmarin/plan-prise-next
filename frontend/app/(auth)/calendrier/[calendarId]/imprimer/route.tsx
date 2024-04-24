import { notFound } from "next/navigation";
import PrintPDF from "@/app/(auth)/calendrier/[calendarId]/imprimer/pdf";
import { routes } from "@/app/routes-schema";
import { renderToBuffer } from "@react-pdf/renderer";

import { getServerSession } from "@plan-prise/auth/get-session";
import prisma from "@plan-prise/db-prisma";

export const GET = async (request: Request, context: { params: unknown }) => {
  const { calendarId } = routes.calendarPrint.$parseParams(context.params);

  const session = await getServerSession();

  if (!calendarId || !session?.user) {
    return notFound();
  }

  const calendar = await prisma.calendar.findFirstOrThrow({
    where: { displayId: calendarId, userId: session.user.id },
  });
  const medicaments = await prisma.medicament.findMany({
    where: { id: { in: (calendar.data ?? []).map((row) => row.medicId) } },
  });

  const buffer = await renderToBuffer(
    <PrintPDF
      calendar={calendar}
      medicaments={medicaments}
      user={session?.user}
    />,
  );

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Calendrier de prise #${calendar.displayId}.pdf"`,
    },
  });
};

export const dynamic = "force-dynamic";
