"use client";

import PlanCardHeader from "@/app/(auth)/plan/[id]/PlanCardHeader";
import type { PlanDataItem } from "@/types/plan";
import type {
  Medicament,
  PrincipeActif
} from "@prisma/client";
import { useState } from "react";

const PlanCard = ({
  data: _data,
  medicament,
}: {
  data: PlanDataItem;
  medicament: Medicament & {
    principesActifs: PrincipeActif[];
    voiesAdministrationParsed: string[];
  };
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="rounded-lg p-4 shadow-md">
      <PlanCardHeader
        denomination={medicament.denomination}
        principesActifs={medicament.principesActifs}
        voieAdministration={medicament.voiesAdministrationParsed}
        open={showDetails}
        toggle={() => setShowDetails((showDetails) => !showDetails)}
      />
    </div>
  );
};
export default PlanCard;
