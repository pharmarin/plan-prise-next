import { notFound } from "next/navigation";
import PrintPDF from "@/app/(auth)/plan/[planId]/imprimer/pdf-document";
import { migrateMedicsOrder } from "@/app/(auth)/plan/actions";
import { routes } from "@/app/routes-schema";
import { renderToBuffer } from "@react-pdf/renderer";

import { getServerSession } from "@plan-prise/auth/get-session";
import prisma from "@plan-prise/db-prisma";

export const GET = async (request: Request, context: { params: unknown }) => {
  const { planId } = routes.planPrint.$parseParams(context.params);

  const session = await getServerSession();

  if (!planId || !session?.user) {
    return notFound();
  }

  const plan = await prisma.plan.findFirstOrThrow({
    where: { displayId: planId, userId: session.user.id },
  });

  const data = await migrateMedicsOrder(plan);

  const medics = await prisma.medicament.findMany({
    where: { OR: Object.keys(data).map((medicId) => ({ id: medicId })) },
    include: { principesActifs: true, commentaires: true, precaution: true },
  });

  const buffer = await renderToBuffer(
    <PrintPDF medicaments={medics} plan={plan} user={session?.user} />,
  );

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Plan de prise #${plan.displayId}.pdf"`,
    },
  });
};

export const dynamic = "force-dynamic";
