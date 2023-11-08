import { PLAN_SETTINGS_DEFAULT } from "@/app/(auth)/plan/_lib/constants";
import type { Commentaire, Medicament } from "@prisma/client";
import { VoieAdministration } from "@prisma/client";

export const extractPosologie = (data?: string) => data ?? "";

export const extractCommentaire = (
  commentaire: Commentaire,
  data?: { checked?: boolean; texte?: string },
) => ({
  checked:
    data?.checked === true ||
    (data?.checked === undefined &&
      (commentaire.population ?? "").length === 0),
  texte: data?.texte ?? commentaire.texte,
});

export const extractIndication = (
  medicament: Medicament | PP.Medicament.Custom,
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
  medicament: Medicament | PP.Medicament.Custom,
  data?: string,
) => {
  const defaultValue =
    "conservationDuree" in medicament &&
    Array.isArray(medicament.conservationDuree)
      ? medicament.conservationDuree
      : null;

  return {
    custom: (data ?? "").length > 0,
    values: data
      ? [
          {
            duree:
              defaultValue?.find(
                (conservation) => conservation.laboratoire === data,
              )?.duree ?? "",
            laboratoire: data,
          },
        ]
      : defaultValue ?? [],
  };
};

export const extractVoieAdministration = (
  medicament: Medicament | PP.Medicament.Custom,
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

export const extractPosologiesSettings = (
  posos?: PP.Plan.Settings["posos"],
) => {
  if (!posos) {
    return [];
  }

  return Object.keys(PLAN_SETTINGS_DEFAULT.posos)
    .map((poso) =>
      posos?.[poso as keyof (typeof PLAN_SETTINGS_DEFAULT)["posos"]] ??
      PLAN_SETTINGS_DEFAULT.posos[
        poso as keyof (typeof PLAN_SETTINGS_DEFAULT)["posos"]
      ] === true
        ? poso
        : undefined,
    )
    .filter(
      (poso): poso is keyof (typeof PLAN_SETTINGS_DEFAULT)["posos"] =>
        poso !== undefined,
    );
};
