"use client";

import { toYYYYMMDD } from "@/app/(auth)/calendrier/utils";
import type { Calendar } from "@prisma/client";
import { set } from "lodash-es";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  id?: Calendar["id"];
  displayId?: Calendar["displayId"];
  data?: {
    medicId: string;
    data: (Partial<PP.Calendar.DataItem> & {
      startDate: string;
      endDate: string;
    })[];
  }[];
  isSaving: boolean;
  touched: boolean;
};

type Actions = {
  addMedic: (id: string) => void;
  removeMedic: (id: string) => void;
  setData: (
    medicId: string,
    path: string,
    value: string | boolean | Date,
  ) => void;
  pushEmptyIteration: (medicId: string) => void;
  removeIteration: (medicId: string, index: number) => void;
  setIsSaving: (isSaving: boolean) => void;
};

export const emptyIteration = (startDate?: Date) => ({
  startDate: toYYYYMMDD(startDate ?? new Date()),
  endDate: toYYYYMMDD(startDate ?? new Date()),
  frequency: 1,
  quantity: "1",
});

const useCalendarStore = create(
  subscribeWithSelector(
    immer<State & Actions>((setState) => ({
      data: undefined,
      isSaving: false,
      touched: false,
      addMedic: (medicId) =>
        setState((state) => {
          if (!state.data) {
            state.data = [];
          }

          if (!state.data.map((row) => row.medicId).includes(medicId)) {
            state.data.push({
              medicId,
              data: [],
            });
          }
        }),
      removeMedic: (medicId) =>
        setState((state) => {
          state.data = state.data?.filter((row) => row.medicId !== medicId);
        }),
      setData: (medicId, path, value) => {
        setState((state) => {
          const medicIndex = state.data?.findIndex(
            (row) => row.medicId === medicId,
          );
          state.data = set(
            state.data ?? [],
            `${medicIndex}.data.${path}`,
            value,
          ) as PP.Calendar.Data;
        });
      },
      pushEmptyIteration: (medicId) =>
        setState((state) => {
          if (!state.data) {
            state.data = [];
          }

          const entry = state.data.find((row) => row.medicId === medicId);
          const previousEndDate =
            entry?.data?.[(entry.data ?? [])?.length - 1]?.endDate;

          if (!entry?.data) {
            entry!.data = [];
          }

          entry?.data.push(
            emptyIteration(
              previousEndDate ? new Date(previousEndDate) : undefined,
            ),
          );
        }),
      removeIteration: (medicId, index) =>
        setState((state) => {
          const entry = state.data?.find((row) => row.medicId === medicId);
          entry!.data =
            entry?.data.filter((_, iteration) => iteration !== index) ?? [];
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
