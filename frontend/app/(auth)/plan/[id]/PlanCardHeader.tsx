import PlanCardHeaderUI from "@/app/(auth)/plan/[id]/_ui/PlanCardHeaderUI";
import { parseVoieAdministration } from "@/app/(auth)/plan/[id]/state";
import Button from "@/components/forms/inputs/Button";
import type {
  MedicamentIdentifier,
  MedicamentInclude,
} from "@/types/medicament";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";

const PlanCardHeader = ({
  medicament,
  open,
  removeMedic,
  toggle,
}: {
  medicament: MedicamentInclude;
  open: boolean;
  removeMedic: (medicament: MedicamentIdentifier) => void;
  toggle: () => void;
}) => {
  return (
    <PlanCardHeaderUI
      buttons={
        <>
          <Button
            className="space-x-1 rounded-full bg-white py-0 text-red-600"
            color="red"
            onClick={() =>
              removeMedic({
                id: medicament.id,
                denomination: medicament.denomination,
              })
            }
            outline
            tabIndex={-1}
          >
            <small className="mr-auto">
              Supprimer<span className="hidden sm:inline"> la ligne</span>
            </small>
            <XMarkIcon className="h-3 w-3" />
          </Button>
          <Button
            className="space-x-1 rounded-full bg-white py-0 text-gray-600"
            onClick={() => toggle()}
            color="white"
            outline
            tabIndex={-1}
          >
            <small className="mr-auto">
              {open ? "Masquer" : "Afficher"}
              <span className="hidden sm:inline"> les détails</span>
            </small>
            {open ? (
              <ChevronUpIcon className="h-3 w-3" />
            ) : (
              <ChevronDownIcon className="h-3 w-3" />
            )}
          </Button>
        </>
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
          {medicament?.voiesAdministration &&
            `Voie 
          ${parseVoieAdministration(medicament.voiesAdministration).join(
            " ou ",
          )}`}
        </small>
      </div>
    </PlanCardHeaderUI>
  );
};
export default PlanCardHeader;
