import type { Medicament } from "@prisma/client";
import { VoieAdministration } from "@prisma/client";

export const switchVoieAdministration = (
  voieAdministration: VoieAdministration,
) => {
  switch (voieAdministration) {
    case VoieAdministration.AURICULAIRE:
      return "auriculaire";
    case VoieAdministration.AUTRE:
      return "inconnue";
    case VoieAdministration.CUTANEE:
      return "cutanée";
    case VoieAdministration.INHALEE:
      return "inhalée";
    case VoieAdministration.INTRA_MUSCULAIRE:
      return "intra-musculaire";
    case VoieAdministration.INTRA_URETRALE:
      return "intra-urétrale";
    case VoieAdministration.INTRA_VEINEUX:
      return "intra-veineuse";
    case VoieAdministration.NASALE:
      return "nasale";
    case VoieAdministration.OCULAIRE:
      return "oculaire";
    case VoieAdministration.ORALE:
      return "orale";
    case VoieAdministration.RECTALE:
      return "rectale";
    case VoieAdministration.SOUS_CUTANEE:
      return "sous-cutanée";
    case VoieAdministration.VAGINALE:
      return "vaginale";
    default:
      return "";
  }
};

export const extractVoieAdministration = (
  medicament: Medicament | PP.Medicament.Custom,
) => {
  if (
    "voiesAdministration" in medicament &&
    Array.isArray(medicament.voiesAdministration)
  ) {
    return medicament.voiesAdministration.map((voieAdministration) =>
      switchVoieAdministration(voieAdministration),
    );
  } else {
    return [];
  }
};
