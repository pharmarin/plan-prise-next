"use client";

import { PLAN_SETTINGS_DEFAULT } from "@/app/(auth)/plan/_lib/constants";
import type { PlanInclude } from "@/types/plan";
import { type Plan } from "@prisma/client";
import type { JsonValue } from "@prisma/client/runtime/library";
import { merge, set, unset } from "lodash";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  id?: Plan["id"];
  data?: Plan["data"];
  medics?: string[];
  settings?: Plan["settings"];
  isSaving: boolean;
  canPrint: boolean | string;
};

type Actions = {
  init: (plan: PlanInclude) => void;
  setData: (path: string, value: string | boolean) => void;
  unsetData: (path: string) => void;
  addMedic: (id: string) => void;
  removeMedic: (id: string) => void;
  setSetting: (path: string, value: boolean) => void;
  setIsSaving: (isSaving: boolean) => void;
  setCanPrint: (canPrint: boolean | string) => void;
};

const usePlanStore = create(
  subscribeWithSelector(
    immer<State & Actions>((setState) => ({
      id: undefined,
      data: undefined,
      medics: undefined,
      settings: undefined,
      isSaving: false,
      canPrint: false,
      init: (plan) =>
        setState((state) => {
          state.id = plan.id;
          state.data = plan.data;
          state.medics = Array.isArray(plan.medicsOrder)
            ? (plan.medicsOrder as string[])
            : [];
          state.settings = merge(PLAN_SETTINGS_DEFAULT, plan.settings);
          state.canPrint =
            (state.medics || []).length > 0
              ? true
              : "Veuillez ajouter des médicaments pour imprimer le plan de prise";
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
      setSetting: (path, value) =>
        setState((state) => {
          set((state.settings || {}) as object, path, value) as JsonValue;
        }),
      setIsSaving: (isSaving) =>
        setState((state) => {
          state.isSaving = isSaving;
        }),
      setCanPrint: (canPrint) =>
        setState((state) => {
          state.canPrint = (state.medics || []).length > 0 ? canPrint : false;
        }),
    })),
  ),
);

export default usePlanStore;
