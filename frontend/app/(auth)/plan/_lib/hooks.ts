"use client";

import {
  extractConservation,
  extractIndication,
  parseData,
} from "@/app/(auth)/plan/_lib/functions";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import type {
  CustomMedicament,
  MedicamentConservationDuree,
} from "@/types/medicament";
import type { Medicament } from "@prisma/client";
import { useEffect, useState } from "react";

export const useIndication = (medicament: Medicament | CustomMedicament) => {
  const customData = usePlanStore(
    (state) =>
      parseData(state.data)?.[
        "id" in medicament ? medicament.id : medicament.denomination
      ]?.indication,
  );

  const [indications, setIndications] = useState<string[]>(
    extractIndication(medicament, customData),
  );

  useEffect(() => {
    setIndications(extractIndication(medicament, customData));
  }, [customData, medicament]);

  return indications;
};

export const useConservation = (medicament: Medicament | CustomMedicament) => {
  const customData = usePlanStore(
    (state) =>
      parseData(state.data)?.[
        "id" in medicament ? medicament.id : medicament.denomination
      ]?.conservation,
  );

  const [conservation, setConservation] = useState<{
    custom: boolean;
    values: MedicamentConservationDuree;
  }>(extractConservation(medicament, customData));

  useEffect(() => {
    setConservation(extractConservation(medicament, customData));
  }, [customData, medicament]);

  return conservation;
};
