import { notFound } from "next/navigation";
import EditMedicClient from "@/app/(auth)/admin/medics/[id]/client";

import prisma from "@plan-prise/db-prisma";

const MedicServer = async ({ params }: { params: { id: string } }) => {
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

export default MedicServer;
