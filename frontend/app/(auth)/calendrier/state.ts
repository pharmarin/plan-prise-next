"use client";

import { toYYYYMMDD } from "@/app/(auth)/calendrier/utils";
import { set } from "lodash-es";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  id?: string;
  data?: Record<
    string,
    (Partial<PP.Calendar.DataItem> & { startDate: string; endDate: string })[]
  >;
  isSaving: boolean;
  touched: boolean;
};

type Actions = {
  addMedic: (id: string) => void;
  removeMedic: (id: string) => void;
  setData: (path: string, value: string | boolean | Date) => void;
  pushEmptyIteration: (medicId: string) => void;
  removeIteration: (medicId: string, index: number) => void;
  setIsSaving: (isSaving: boolean) => void;
};

export const emptyIteration = (startDate?: Date) => ({
  startDate: toYYYYMMDD(startDate ?? new Date()),
  endDate: toYYYYMMDD(startDate ?? new Date()),
  frequency: 1,
  quantity: 1,
});

const useCalendarStore = create(
  subscribeWithSelector(
    immer<State & Actions>((setState) => ({
      id: undefined,
      data: undefined,
      isSaving: false,
      touched: false,
      addMedic: (medicId) =>
        setState((state) => {
          if (!state.data) {
            state.data = {};
          }

          if (!Object.keys(state.data).includes(medicId)) {
            state.data[medicId] = [];
          }
        }),
      removeMedic: (medicId) =>
        setState((state) => {
          if (state.data?.[medicId]) {
            delete state.data[medicId];
          }
        }),
      setData: (path, value) => {
        setState((state) => {
          state.data = set(
            (state.data ?? {}) as object,
            path,
            value,
          ) as PP.Calendar.Data;
        });
      },
      pushEmptyIteration: (medicId) =>
        setState((state) => {
          if (!state.data) {
            state.data = {};
          }

          const previousEndDate =
            state.data[medicId]?.[(state.data[medicId] ?? [])?.length - 1]
              ?.endDate;

          state.data[medicId]?.push(
            emptyIteration(
              previousEndDate ? new Date(previousEndDate) : undefined,
            ),
          );
        }),
      removeIteration: (medicId, index) =>
        setState((state) => {
          if (state.data?.[medicId]) {
            set(
              state,
              `data.${medicId}`,
              (state.data[medicId] ?? []).filter(
                (_id, iteration) => iteration !== index,
              ),
            );
          }
        }),
      setIsSaving: (isSaving) =>
        setState((state) => {
          state.isSaving = isSaving;

          if (isSaving === false) state.touched = false;
        }),
    })),
  ),
);

export default useCalendarStore;
