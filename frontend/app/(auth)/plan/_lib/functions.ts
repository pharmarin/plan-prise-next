import type { MedicamentConservationDuree } from "@/types/medicament";
import type { Commentaire, Medicament } from "@prisma/client";

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

export const extractIndication = (medicament: Medicament, data?: string) => {
  const indications = Array.isArray(medicament.indications)
    ? (medicament.indications as string[])
    : [];

  if (data && data.length > 0) {
    return [data];
  }

  return indications;
};

export const extractConservation = (medicament: Medicament, data?: string) => {
  const defaultValue = Array.isArray(medicament.conservationDuree)
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
