import MedicsClient from "@/app/(auth)/admin/medicaments/client";
import { routes } from "@/app/routes-schema";
import { Navigation } from "@/app/state-navigation";

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
      <Navigation
        title={PAGE_TITLE}
        returnTo={routes.adminDashboard()}
        options={[
          {
            icon: "plus",
            path: routes.medicamentCreate(),
          },
        ]}
      />
      <MedicsClient medicaments={medicaments} />
    </>
  );
};

export default MedicsServer;

export const metadata = {
  title: PAGE_TITLE,
};
