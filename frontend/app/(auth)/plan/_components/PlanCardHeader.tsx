import PlanCardHeaderUI from "@/app/(auth)/plan/_components/_ui/PlanCardHeaderUI";
import { extractVoieAdministration } from "@/utils/medicament";
import { XIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { Button } from "@plan-prise/ui/shadcn/ui/button";

const PlanCardHeader = ({
  medicament,
  removeMedic,
}: {
  medicament: PP.Medicament.Include;
  removeMedic: (medicament: PP.Medicament.Identifier) => void;
}) => {
  return (
    <PlanCardHeaderUI
      buttons={
        <Button
          className="space-x-1 rounded-full bg-white py-0 text-red-500"
          onClick={() =>
            removeMedic({
              id: medicament.id,
              denomination: medicament.denomination,
            })
          }
          tabIndex={-1}
          variant="destructive"
        >
          <small className="mr-auto">
            Supprimer<span className="hidden sm:inline"> la ligne</span>
          </small>
          <XIcon className="h-3 w-3" />
        </Button>
      }
    >
      <div className="flex flex-grow flex-col">
        <span
          className={twMerge(
            "text-truncate text-lg font-bold",
            !medicament && "mb-2 h-6 w-1/3 animate-pulse rounded bg-gray-300",
          )}
        >
          {medicament?.denomination}
        </span>
        <small
          className={twMerge(
            "text-truncate text-gray-500",
            !medicament && "mb-2 h-4 w-1/2 animate-pulse rounded bg-gray-300",
          )}
        >
          {(medicament?.principesActifs || [])
            .map((principeActif) => principeActif.denomination)
            .join(" + ")}
        </small>
        <small
          className={twMerge(
            "text-truncate italic text-gray-500",
            !medicament && "h-4 w-1/4 animate-pulse rounded bg-gray-300",
          )}
        >
          {medicament?.voiesAdministration.length > 0 &&
            `Voie 
          ${extractVoieAdministration(medicament).join(" ou ")}`}
        </small>
      </div>
    </PlanCardHeaderUI>
  );
};

export default PlanCardHeader;
