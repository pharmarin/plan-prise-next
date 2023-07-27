import { parseVoieAdministration } from "@/app/(auth)/plan/[id]/state";
import Button from "@/components/forms/inputs/Button";
import type { MedicamentInclude } from "@/types/medicament";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";

const PlanCardHeader = ({
  medicament,
  open,
  toggle,
}: {
  medicament?: MedicamentInclude;
  open: boolean;
  toggle: () => void;
}) => {
  return (
    <div className="flex bg-gray-100 p-4 pb-2">
      <div className="flex flex-grow flex-col">
        <span
          className={twMerge(
            "text-truncate text-lg font-bold",
            !medicament && "mb-2 h-6 w-1/3 animate-pulse rounded bg-gray-300"
          )}
        >
          {medicament?.denomination}
        </span>
        <small
          className={twMerge(
            "text-truncate text-gray-500",
            !medicament && "mb-2 h-4 w-1/2 animate-pulse rounded bg-gray-300"
          )}
        >
          {(medicament?.principesActifs || [])
            .map((principeActif) => principeActif.denomination)
            .join(" + ")}
        </small>
        <small
          className={twMerge(
            "text-truncate italic text-gray-500",
            !medicament && "h-4 w-1/4 animate-pulse rounded bg-gray-300"
          )}
        >
          {medicament?.voiesAdministration &&
            `Voie 
          ${parseVoieAdministration(medicament.voiesAdministration).join(
            " ou "
          )}`}
        </small>
      </div>
      <div className="flex flex-shrink-0 flex-grow-0 flex-col space-y-1">
        <Button
          className="space-x-1 rounded-full bg-white py-0 text-red-600"
          color="red"
          outline
          tabIndex={-1}
        >
          <small className="mr-auto">
            {false ? ( //isDeleting ? (
              "Suppression en cours"
            ) : (
              <>
                Supprimer<span className="hidden sm:inline"> la ligne</span>
              </>
            )}
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
      </div>
    </div>
  );
};
export default PlanCardHeader;
