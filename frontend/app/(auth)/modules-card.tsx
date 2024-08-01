import type { ReactNode } from "react";
import { useEffect } from "react";
import { findMedicAction } from "@/app/actions";
import { extractVoieAdministration } from "@/utils/medicament";
import { XIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

import PP_Error from "@plan-prise/errors";
import { Button } from "@plan-prise/ui/button";
import CardUI from "@plan-prise/ui/components/card";
import CardHeaderUI from "@plan-prise/ui/components/card-header";
import CardLoading from "@plan-prise/ui/components/card-loading";
import { cn } from "@plan-prise/ui/shadcn/lib/utils";

const Card = ({
  children,
  medicamentData,
  medicamentId,
  removeMedic,
}: {
  children: (medicament: PP.Medicament.Include) => ReactNode;
  medicamentData?: PP.Medicament.Include;
  medicamentId: string;
  removeMedic: (medicament: PP.Medicament.Identifier) => void;
}) => {
  const {
    executeAsync: findMedic,
    result: { data: medicament },
    isExecuting: isLoading,
    status,
  } = useAction(findMedicAction);
  const isSuccess = status === "hasSucceeded";
  const isError = status === "hasErrored";

  useEffect(() => {
    if (medicamentData === undefined && !isLoading && !isSuccess && !isError) {
      void findMedic({ medicId: medicamentId });
    }
  }, [isError, findMedic, isLoading, isSuccess, medicamentData, medicamentId]);

  if (!medicamentData && ((!isSuccess && !isError) || isLoading)) {
    return <CardLoading type="fetching" />;
  }

  if (!medicamentData)
    if (!medicamentData && !medicament) {
      console.error(
        "Error rendering card for",
        medicamentData,
        medicament,
        isLoading,
      );
      throw new PP_Error("MEDICAMENT_LOADING_ERROR");
    }

  return (
    <CardUI>
      <CardHeader
        medicament={medicamentData ?? medicament!}
        removeMedic={removeMedic}
      />
      {children(medicamentData ?? medicament!)}
    </CardUI>
  );
};

const CardHeader = ({
  medicament,
  removeMedic,
}: {
  medicament: PP.Medicament.Include;
  removeMedic: (medicament: PP.Medicament.Identifier) => void;
}) => {
  return (
    <CardHeaderUI
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
          className={cn(
            "text-truncate text-lg font-bold",
            !medicament && "mb-2 h-6 w-1/3 animate-pulse rounded bg-gray-300",
          )}
          data-testid="plan-card-header-denomination"
        >
          {medicament?.denomination}
        </span>
        <small
          className={cn(
            "text-truncate text-gray-500",
            !medicament && "mb-2 h-4 w-1/2 animate-pulse rounded bg-gray-300",
          )}
        >
          {(medicament?.principesActifs || [])
            .map((principeActif) => principeActif.denomination)
            .join(" + ")}
        </small>
        <small
          className={cn(
            "text-truncate italic text-gray-500",
            !medicament && "h-4 w-1/4 animate-pulse rounded bg-gray-300",
          )}
        >
          {medicament?.voiesAdministration.length > 0 &&
            `Voie 
          ${extractVoieAdministration(medicament).join(" ou ")}`}
        </small>
      </div>
    </CardHeaderUI>
  );
};

export default Card;
