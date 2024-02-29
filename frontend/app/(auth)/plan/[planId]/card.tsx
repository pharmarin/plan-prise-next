import { useEffect } from "react";
import { useAsyncCallback } from "@/app/_safe-actions/use-async-hook";
import PlanCardUI from "@/app/(auth)/plan/_components/_ui/PlanCardUI";
import { getMedicAction } from "@/app/(auth)/plan/[planId]/actions";
import PlanCardBody from "@/app/(auth)/plan/[planId]/card-body";
import PlanCardHeader from "@/app/(auth)/plan/[planId]/card-header";
import PlanCardLoading from "@/app/(auth)/plan/[planId]/card-loading";

import PP_Error from "@plan-prise/errors";

const PlanCard = ({
  medicamentData,
  medicamentId,
  removeMedic,
}: {
  medicamentData?: PP.Medicament.Include;
  medicamentId: string;
  removeMedic: (medicament: PP.Medicament.Identifier) => void;
}) => {
  const [{ data: medicament, isLoading, isSuccess, error }, getMedic] =
    useAsyncCallback(getMedicAction);

  useEffect(() => {
    if (medicamentData === undefined && !isLoading && !isSuccess && !error) {
      void getMedic({ medicId: medicamentId });
    }
  }, [error, getMedic, isLoading, isSuccess, medicamentData, medicamentId]);

  if (!medicamentData && ((!isSuccess && !error) || isLoading)) {
    return <PlanCardLoading type="fetching" />;
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
    <PlanCardUI>
      <PlanCardHeader
        medicament={medicamentData ?? medicament!}
        removeMedic={removeMedic}
      />
      <PlanCardBody medicament={medicamentData ?? medicament!} />
    </PlanCardUI>
  );
};

export default PlanCard;
