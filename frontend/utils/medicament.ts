import type { Medicament } from "@prisma/client";
import { VoieAdministration } from "@prisma/client";

export const voiesAdministrationDisplay: Record<VoieAdministration, string> = {
  [VoieAdministration.AURICULAIRE]: "auriculaire",
  [VoieAdministration.AUTRE]: "inconnue",
  [VoieAdministration.CUTANEE]: "cutanée",
  [VoieAdministration.INHALEE]: "inhalée",
  [VoieAdministration.INTRA_MUSCULAIRE]: "intra-musculaire",
  [VoieAdministration.INTRA_URETRALE]: "intra-urétrale",
  [VoieAdministration.INTRA_VEINEUX]: "intra-veineuse",
  [VoieAdministration.NASALE]: "nasale",
  [VoieAdministration.OCULAIRE]: "oculaire",
  [VoieAdministration.ORALE]: "orale",
  [VoieAdministration.RECTALE]: "rectale",
  [VoieAdministration.SOUS_CUTANEE]: "sous-cutanée",
  [VoieAdministration.VAGINALE]: "vaginale",
};

export const extractVoieAdministration = (
  medicament: Medicament | PP.Medicament.Custom,
) => {
  if (
    "voiesAdministration" in medicament &&
    Array.isArray(medicament.voiesAdministration)
  ) {
    return medicament.voiesAdministration.map(
      (voieAdministration) => voiesAdministrationDisplay[voieAdministration],
    );
  } else {
    return [];
  }
};
