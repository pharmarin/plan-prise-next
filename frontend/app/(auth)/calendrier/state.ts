"use client";

import { set } from "lodash-es";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  id?: string;
  data?: Record<
    string,
    (Omit<PP.Calendar.DataItem, "startDate" | "endDate"> & {
      startDate?: Date;
      endDate?: Date;
    })[]
  >;
};

type Actions = {
  addMedic: (id: string) => void;
  removeMedic: (id: string) => void;
  setData: (path: string, value: string | boolean | Date) => void;
  pushEmptyIteration: (medicId: string) => void;
  removeIteration: (medicId: string, index: number) => void;
};

export const emptyIteration = () => ({
  startDate: undefined,
  endDate: undefined,
  frequency: 1,
  quantity: 1,
});

const useCalendarStore = create(
  subscribeWithSelector(
    immer<State & Actions>((setState) => ({
      id: undefined,
      data: undefined,
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

          state.data[medicId]?.push(emptyIteration());
        }),
      removeIteration: (medicId, index) =>
        setState((state) => {
          if (state.data?.[medicId]) {
            delete state.data[medicId]![index];
          }
        }),
    })),
  ),
);

export default useCalendarStore;
