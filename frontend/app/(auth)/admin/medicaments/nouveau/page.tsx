import MedicClient from "@/app/(auth)/admin/medicaments/_common/client";
import { routes } from "@/app/routes-schema";
import { Navigation } from "@/app/state-navigation";

const MedicNew = () => {
  return (
    <>
      <Navigation
        title="Ajouter un médicament"
        returnTo={routes.medicaments()}
      />
      <MedicClient />
    </>
  );
};

export const metadata = {
  title: "Nouveau médicament",
};

export default MedicNew;
