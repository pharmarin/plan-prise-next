import type { MedicamentConservationDuree } from "@/types/medicament";
import type { PlanDataItem } from "@/types/plan";
import {
  VoieAdministration,
  type Commentaire,
  type Medicament,
  type Plan,
} from "@prisma/client";

type CustomMedicament = { denomination: string };

export const parseData = (data?: Plan["data"]) => {
  if (typeof data === "object" && data) {
    return data as Record<string, PlanDataItem>;
  } else {
    return {};
  }
};

export const extractPosologie = (data?: string) => data || "";

export const extractCommentaire = (
  commentaire: Commentaire,
  data?: { checked?: boolean; texte?: string },
) => ({
  checked:
    data?.checked === true ||
    (data?.checked === undefined &&
      (commentaire.population || "").length === 0),
  texte: data?.texte || commentaire.texte,
});

export const extractIndication = (
  medicament: Medicament | CustomMedicament,
  data?: string,
) => {
  const indications =
    "indications" in medicament && Array.isArray(medicament.indications)
      ? (medicament.indications as string[])
      : [];

  if (data && data.length > 0) {
    return [data];
  }

  return indications;
};

export const extractConservation = (
  medicament: Medicament | CustomMedicament,
  data?: string,
) => {
  const defaultValue =
    "conservationDuree" in medicament &&
    Array.isArray(medicament.conservationDuree)
      ? (medicament.conservationDuree as MedicamentConservationDuree)
      : null;

  return {
    custom: (data || "").length > 0,
    values: data
      ? [
          {
            duree:
              defaultValue?.find(
                (conservation) => conservation.laboratoire === data,
              )?.duree || "",
            laboratoire: data,
          },
        ]
      : defaultValue || [],
  };
};

export const extractVoieAdministration = (
  medicament: Medicament | CustomMedicament,
) => {
  if (
    "voiesAdministration" in medicament &&
    Array.isArray(medicament.voiesAdministration)
  ) {
    return medicament.voiesAdministration.map((voieAdministration) => {
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
    });
  } else {
    return [];
  }
};
