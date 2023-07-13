"use client";

import PlanCardBody from "@/app/(auth)/plan/[id]/PlanCardBody";
import PlanCardHeader from "@/app/(auth)/plan/[id]/PlanCardHeader";
import type { PlanDataItem } from "@/types/plan";
import type { Medicament, PrincipeActif } from "@prisma/client";
import { useState } from "react";

const PlanCard = ({
  data,
  medicament,
}: {
  data: PlanDataItem;
  medicament: Medicament & {
    indicationsParsed: string[];
    principesActifs: PrincipeActif[];
    voiesAdministrationParsed: string[];
  };
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg shadow-md">
      <PlanCardHeader
        denomination={medicament.denomination}
        principesActifs={medicament.principesActifs}
        voieAdministration={medicament.voiesAdministrationParsed}
        open={showDetails}
        toggle={() => setShowDetails((showDetails) => !showDetails)}
      />

      <PlanCardBody data={data} medicament={medicament} />
    </div>
  );
};
export default PlanCard;
