"use client";

import type { PlanDataItem, PlanInclude } from "@/types/plan";
import { VoieAdministration, type Medicament, type Plan } from "@prisma/client";
import type { JsonValue } from "@prisma/client/runtime/library";
import { set, unset } from "lodash";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  id?: Plan["id"];
  data?: Plan["data"];
  medics?: string[];
  settings?: Plan["settings"];
  isSaving: boolean;
};

type Actions = {
  init: (plan: PlanInclude) => void;
  setData: (path: string, value: string | boolean) => void;
  unsetData: (path: string) => void;
  addMedic: (id: string) => void;
  removeMedic: (id: string) => void;
  setIsSaving: (isSaving: boolean) => void;
};

const usePlanStore = create(
  subscribeWithSelector(
    immer<State & Actions>((setState) => ({
      id: undefined,
      data: undefined,
      medics: undefined,
      settings: undefined,
      isSaving: false,
      init: (plan) =>
        setState((state) => {
          state.id = plan.id;
          state.data = plan.data;
          state.medics = plan.medicsIdSorted;
          state.settings = plan.settings;
        }),
      setData: (path, value) => {
        setState((state) => {
          state.data = set(
            (state.data || {}) as object,
            path,
            value,
          ) as JsonValue;
        });
      },
      unsetData: (path) =>
        setState((state) => {
          unset((state.data || {}) as object, path);
        }),
      addMedic: (medicId) =>
        setState((state) => {
          state.medics?.push(medicId);
        }),
      removeMedic: (medicId) =>
        setState((state) => {
          state.medics = state.medics?.filter((id) => id !== medicId);
        }),
      setIsSaving: (isSaving) =>
        setState((state) => {
          state.isSaving = isSaving;
        }),
    })),
  ),
);

export default usePlanStore;

export const parseData = (data?: Plan["data"]) => {
  if (typeof data === "object" && data) {
    return data as Record<string, PlanDataItem>;
  } else {
    return {};
  }
};

export const parseVoieAdministration = (
  voiesAdministration: Medicament["voiesAdministration"],
): string[] => {
  if (
    Array.isArray(voiesAdministration) &&
    voiesAdministration.every((voieAdministration) =>
      Object.values(VoieAdministration).includes(
        voieAdministration as VoieAdministration,
      ),
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
