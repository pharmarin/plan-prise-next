import { parseVoieAdministration } from "@/app/(auth)/plan/[id]/state";
import Button from "@/components/forms/inputs/Button";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import type { Medicament, PrincipeActif } from "@prisma/client";

const PlanCardHeader = ({
  denomination,
  open,
  toggle,
  principesActifs,
  voieAdministration,
}: {
  denomination: Medicament["denomination"];
  open: boolean;
  principesActifs: PrincipeActif[];
  toggle: () => void;
  voieAdministration: Medicament["voiesAdministration"];
}) => {
  return (
    <div className="flex bg-gray-100 p-4 pb-2">
      <div className="flex flex-grow flex-col">
        <span className="text-truncate text-lg font-bold">{denomination}</span>
        <small className="text-truncate text-gray-500">
          {principesActifs
            .map((principeActif) => principeActif.denomination)
            .join(" + ")}
        </small>
        <small className="text-truncate italic text-gray-500">
          Voie {parseVoieAdministration(voieAdministration).join(" ou ")}
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
