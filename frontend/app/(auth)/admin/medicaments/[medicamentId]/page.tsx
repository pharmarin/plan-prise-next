import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditMedicClient from "@/app/(auth)/admin/medicaments/_common/client";
import { routes } from "@/app/routes-schema";

import prisma from "@plan-prise/db-prisma";

const MedicServer = async ({ params }: { params: unknown }) => {
  try {
    const { medicamentId } = routes.medicament.$parseParams(params);

    const medicament = await prisma.medicament.findFirstOrThrow({
      where: { id: medicamentId },
      include: { commentaires: true, precaution: true, principesActifs: true },
    });

    return <EditMedicClient medicament={medicament} />;
  } catch (error) {
    notFound();
  }
};

export async function generateMetadata({
  params,
}: {
  params: unknown;
}): Promise<Metadata> {
  const { medicamentId } = routes.medicament.$parseParams(params);

  const medicament = await prisma.medicament.findFirstOrThrow({
    where: { id: medicamentId },
    select: { denomination: true },
  });

  return {
    title: `Modification de ${medicament.denomination}`,
  };
}

export default MedicServer;
