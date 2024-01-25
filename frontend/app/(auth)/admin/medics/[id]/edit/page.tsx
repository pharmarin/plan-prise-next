import { notFound } from "next/navigation";
import EditMedicClient from "@/app/(auth)/admin/medics/[id]/edit/client";
import { Navigation } from "@/app/state-navigation";

import prisma from "@plan-prise/db-prisma";

const EditMedicServer = async ({ params }: { params: { id: string } }) => {
  try {
    const medicament = await prisma.medicament.findFirstOrThrow({
      where: { id: params.id },
      include: { commentaires: true, precaution: true, principesActifs: true },
    });

    return (
      <>
        <Navigation title={`Modification de ${medicament.denomination}`} />
        <EditMedicClient medicament={medicament} />
      </>
    );
  } catch (error) {
    notFound();
  }
};

export default EditMedicServer;
