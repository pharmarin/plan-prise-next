"use client";

import type { Plan } from "@prisma/client";
import type { JsonValue } from "@prisma/client/runtime/library";
import { set, unset } from "lodash-es";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  id?: Plan["id"];
  displayId?: Plan["displayId"];
  data?: PP.Plan.Data1;
  settings?: Plan["settings"];
  isSaving: boolean;
  touched: boolean;
  canPrint: boolean | string;
};

type Actions = {
  setData: (medicId: string, path: string, value: string | boolean) => void;
  unsetData: (medicId: string, path: string) => void;
  setSetting: (path: string, value: boolean) => void;
  setIsSaving: (isSaving: boolean) => void;
  setCanPrint: (canPrint: boolean | string) => void;
};

const usePlanStore = create(
  subscribeWithSelector(
    immer<State & Actions>((setState) => ({
      id: undefined,
      displayId: undefined,
      data: undefined,
      medics: undefined,
      settings: undefined,
      isSaving: false,
      canPrint: true,
      touched: false,
      setData: (medicId, path, value) => {
        setState((state) => {
          state.touched = true;
          const medicIndex = state.data?.findIndex(
            (row) => row.medicId === medicId,
          );
          state.data = set(
            state.data ?? [],
            `${medicIndex}.data.${path}`,
            value,
          ) as PP.Plan.Data1;
        });
      },
      unsetData: (medicId, path) =>
        setState((state) => {
          state.touched = true;
          const medicIndex = state.data?.findIndex(
            (row) => row.medicId === medicId,
          );
          unset(state.data ?? [], `${medicIndex}.data.${path}`);
        }),
      setSetting: (path, value) =>
        setState((state) => {
          state.touched = true;
          set((state.settings ?? {}) as object, path, value) as JsonValue;
        }),
      setIsSaving: (isSaving) =>
        setState((state) => {
          state.isSaving = isSaving;

          if (isSaving === false) state.touched = false;
        }),
      setCanPrint: (canPrint) =>
        setState((state) => {
          state.canPrint = (state.data ?? []).length > 0 ? canPrint : false;
        }),
    })),
  ),
);

export default usePlanStore;
