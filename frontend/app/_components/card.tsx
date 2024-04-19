import type { ReactNode } from "react";
import { useEffect } from "react";
import { findMedicAction } from "@/app/_components/actions";
import CardHeader from "@/app/_components/card-header";
import { useAsyncCallback } from "@/app/_safe-actions/use-async-hook";

import PP_Error from "@plan-prise/errors";
import CardUI from "@plan-prise/ui/components/card";
import CardLoading from "@plan-prise/ui/components/card-loading";

const Card = ({
  medicamentData,
  medicamentId,
  removeMedic,
  renderBody,
}: {
  medicamentData?: PP.Medicament.Include;
  medicamentId: string;
  removeMedic: (medicament: PP.Medicament.Identifier) => void;
  renderBody: (medicament: PP.Medicament.Include) => ReactNode;
}) => {
  const [{ data: medicament, isLoading, isSuccess, isError }, findMedic] =
    useAsyncCallback(findMedicAction);

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
      {renderBody(medicamentData ?? medicament!)}
    </CardUI>
  );
};

export default Card;
