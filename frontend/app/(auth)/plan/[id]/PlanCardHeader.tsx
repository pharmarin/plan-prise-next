import Button from "@/components/forms/inputs/Button";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

const PlanCardHeader = () => {
  return (
    <div className="flex">
      <div className="flex flex-grow flex-col">
        <span className="text-truncate text-lg font-bold">Médicament</span>
        <small className="text-truncate text-gray-500">Nom générique</small>
        <small className="text-truncate italic text-gray-500">
          Voie d&apos;administration
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
          //onClick={() => setShowDetails(!showDetails)}
          color="white"
          outline
          tabIndex={-1}
        >
          <small className="mr-auto">
            {/* showDetails ? "Masquer" : "Afficher" */}
            <span className="hidden sm:inline"> les détails</span>
          </small>
          {
            /* showDetails */ true ? (
              <ChevronUpIcon className="h-3 w-3" />
            ) : (
              <ChevronDownIcon className="h-3 w-3" />
            )
          }
        </Button>
      </div>
    </div>
  );
};
export default PlanCardHeader;
