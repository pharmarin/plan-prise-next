import PrincipesActifsClient from "@/app/(auth)/admin/principes-actifs/client";
import { routes } from "@/app/routes-schema";
import { Navigation } from "@/app/state-navigation";

import prisma from "@plan-prise/db-prisma";

const PAGE_TITLE = "Principes actifs";

const PrincipesActifsServer = async () => {
  const principesActifs = await prisma.principeActif.findMany();

  return (
    <>
      <Navigation title={PAGE_TITLE} returnTo={routes.adminDashboard()} />
      <PrincipesActifsClient principesActifs={principesActifs} />
    </>
  );
};

export default PrincipesActifsServer;

export const metadata = {
  title: PAGE_TITLE,
};
