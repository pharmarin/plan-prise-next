"use client";

import PlanCardHeaderUI from "@/app/(auth)/plan/[id]/_ui/PlanCardHeaderUI";
import PlanCardUI from "@/app/(auth)/plan/[id]/_ui/PlanCardUI";
import Logo from "@/components/navigation/Logo";

const PlanCardLoading = (
  props:
    | {
        denomination: string;
        type: "adding" | "deleting";
      }
    | { type: "fetching" },
) => {
  return (
    <PlanCardUI>
      <PlanCardHeaderUI>
        <div className="absolute inset-0 z-10 flex flex-row items-center justify-center space-x-4 font-bold">
          <Logo className="animate-pulse text-base" />
          <span className="text-gray-700">
            {props.type === "adding" &&
              `Ajout de ${props.denomination} en cours...`}
            {props.type === "deleting" &&
              `Suppression de ${props.denomination} en cours...`}
            {props.type === "fetching" && "Chargement en cours..."}
          </span>
          {/* <PlanCardHeader
            medicament={medicament}
            open={showDetails}
            toggle={() => setShowDetails((showDetails) => !showDetails)}
          /> */}
        </div>
        <div className="flex h-24 flex-grow flex-col">
          <span className="mb-2 h-6 w-1/3 rounded bg-gray-300"></span>
          <small className="mb-2 h-4 w-1/2 rounded bg-gray-300"></small>
          <small className="h-4 w-1/4 rounded bg-gray-300"></small>
        </div>
      </PlanCardHeaderUI>
    </PlanCardUI>
  );
};
export default PlanCardLoading;
