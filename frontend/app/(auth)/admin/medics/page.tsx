import MedicsClient from "@/app/(auth)/admin/medics/client";
import { Navigation } from "@/state/navigation";

import prisma from "@plan-prise/db-prisma";

const PAGE_TITLE = "Médicaments";

const MedicsServer = async () => {
  const medicaments = await prisma.medicament.findMany({
    include: {
      principesActifs: true,
    },
  });

  return (
    <>
      <Navigation title={PAGE_TITLE} returnTo="/admin" />
      <MedicsClient medicaments={medicaments} />
    </>
  );
};

export default MedicsServer;

export const metadata = {
  title: PAGE_TITLE,
};
