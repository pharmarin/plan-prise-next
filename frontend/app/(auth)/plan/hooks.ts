"use client";

import { useEffect, useState } from "react";
import {
  extractConservation,
  extractIndication,
} from "@/app/(auth)/plan/functions";
import usePlanStore from "@/app/(auth)/plan/state";
import type { Medicament } from "@prisma/client";

export const useIndication = (
  medicament: Medicament | PP.Medicament.Custom,
) => {
  const customData = usePlanStore(
    (state) =>
      state.data?.find((row) => row.medicId === medicament.id)?.data
        ?.indication,
  );

  const [indications, setIndications] = useState<string[]>(
    extractIndication(medicament, customData),
  );

  useEffect(() => {
    setIndications(extractIndication(medicament, customData));
  }, [customData, medicament]);

  return indications;
};

export const useConservation = (
  medicament: Medicament | PP.Medicament.Custom,
) => {
  const customData = usePlanStore(
    (state) =>
      state.data?.find((row) => row.medicId === medicament.id)?.data
        ?.conservation,
  );

  const [conservation, setConservation] = useState<{
    custom: boolean;
    values: PP.Medicament.ConservationDuree;
  }>(extractConservation(medicament, customData));

  useEffect(() => {
    setConservation(extractConservation(medicament, customData));
  }, [customData, medicament]);

  return conservation;
};
