"use client";

import type {
  MedicamentConservationDuree,
  MedicamentInclude,
} from "@/types/medicament";
import type { PlanDataItem, PlanInclude } from "@/types/plan";
import { VoieAdministration, type Medicament, type Plan } from "@prisma/client";
import { set } from "lodash";
import { create } from "zustand";

const usePlanStore = create<{
  data?: Plan["data"];
  medics?: MedicamentInclude[];
  settings?: Plan["settings"];
  init: (plan: PlanInclude) => void;
  setData: (path: string, value: string) => void;
}>((setState, getState) => ({
  data: undefined,
  medics: undefined,
  settings: undefined,
  init: (plan) =>
    setState({
      data: plan.data,
      medics: plan.medics,
      settings: plan.settings,
    }),
  setData: (path, value) =>
    setState({
      data: { ...set((getState().data || {}) as object, path, value) },
    }),
}));

export default usePlanStore;

export const parseData = (data?: Plan["data"]) => {
  if (typeof data === "object" && data) {
    return data as Record<string, PlanDataItem>;
  } else {
    return {};
  }
};

export const parseConservationDuree = (
  conservationDuree: Medicament["conservationDuree"]
) => {
  if (Array.isArray(conservationDuree)) {
    return conservationDuree as MedicamentConservationDuree;
  } else {
    return null;
  }
};

export const parseIndications = (
  indications: Medicament["indications"]
): string[] => {
  if (Array.isArray(indications)) {
    return indications as string[];
  } else {
    return [];
  }
};

export const parseVoieAdministration = (
  voiesAdministration: Medicament["voiesAdministration"]
): string[] => {
  if (
    Array.isArray(voiesAdministration) &&
    voiesAdministration.every((voieAdministration) =>
      Object.values(VoieAdministration).includes(
        voieAdministration as VoieAdministration
      )
    )
  ) {
    return voiesAdministration.map((voieAdministration) => {
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
