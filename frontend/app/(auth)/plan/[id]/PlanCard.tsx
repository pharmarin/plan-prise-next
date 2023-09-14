"use client";

import PlanCardBody from "@/app/(auth)/plan/[id]/PlanCardBody";
import PlanCardHeader from "@/app/(auth)/plan/[id]/PlanCardHeader";
import { trpc } from "@/trpc/client";
import type { MedicamentIdentifier } from "@/types/medicament";
import { useState } from "react";

const PlanCard = ({
  medicamentId,
  removeMedic,
}: {
  medicamentId: string;
  removeMedic: (medicament: MedicamentIdentifier) => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    data: medicament,
    isLoading,
    error,
  } = trpc.medics.unique.useQuery(medicamentId);

  if (error) {
    // TODO
    throw new Error();
  }

  return (
    <div className="flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg shadow-md">
      <PlanCardHeader
        medicament={medicament}
        open={showDetails}
        removeMedic={removeMedic}
        toggle={() => setShowDetails((showDetails) => !showDetails)}
      />

      {!isLoading && <PlanCardBody medicament={medicament} />}
    </div>
  );
};
export default PlanCard;
