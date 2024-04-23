import { PLAN_SETTINGS_DEFAULT } from "@/app/(auth)/plan/constants";
import type { Commentaire, Medicament, Plan } from "@prisma/client";

import prisma from "@plan-prise/db-prisma";

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

export const extractPosologiesSettings = (
  posos?: PP.Plan.Settings["posos"],
) => {
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

export const migrateMedicsOrder = async (plan: Plan): Promise<PP.Plan.Data> => {
  let data = {};

  if (plan.medicsOrder) {
    data = Object.fromEntries(
      plan.medicsOrder.map((medicId) => [medicId, plan?.data?.[medicId] ?? {}]),
    );

    await prisma.plan.update({
      where: { id: plan.id },
      data: { medicsOrder: null },
    });
  } else {
    data = plan.data ?? {};
  }

  return data;
};
