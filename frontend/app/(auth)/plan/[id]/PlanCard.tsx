"use client";

import PlanCardBody from "@/app/(auth)/plan/[id]/PlanCardBody";
import PlanCardHeader from "@/app/(auth)/plan/[id]/PlanCardHeader";
import usePlanStore from "@/app/(auth)/plan/[id]/state";
import { useState } from "react";

const PlanCard = ({ medicamentId }: { medicamentId: string }) => {
  const [showDetails, setShowDetails] = useState(false);

  const medicament = usePlanStore((state) =>
    state.medics?.find((medic) => medic.id === medicamentId)
  );

  if (!medicament) {
    // TODO
    throw new Error();
  }

  return (
    <div className="flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg shadow-md">
      <PlanCardHeader
        denomination={medicament.denomination}
        principesActifs={medicament.principesActifs}
        voieAdministration={medicament.voiesAdministration}
        open={showDetails}
        toggle={() => setShowDetails((showDetails) => !showDetails)}
      />

      <PlanCardBody medicament={medicament} />
    </div>
  );
};
export default PlanCard;
