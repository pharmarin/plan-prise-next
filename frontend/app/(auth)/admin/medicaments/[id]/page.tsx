import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditMedicClient from "@/app/(auth)/admin/medicaments/[id]/client";

import prisma from "@plan-prise/db-prisma";

type Params = { id: string };

const MedicServer = async ({ params }: { params: Params }) => {
  try {
    const medicament = await prisma.medicament.findFirstOrThrow({
      where: { id: params.id },
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
  params: Params;
}): Promise<Metadata> {
  const medicament = await prisma.medicament.findFirstOrThrow({
    where: { id: params.id },
    include: { commentaires: true, precaution: true, principesActifs: true },
  });

  return {
    title: `Modification de ${medicament.denomination}`,
  };
}

export default MedicServer;
