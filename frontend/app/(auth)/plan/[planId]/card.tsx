import { useEffect } from "react";
import { useAsyncCallback } from "@/app/_safe-actions/use-async-hook";
import PlanCardUI from "@/app/(auth)/plan/_components/_ui/PlanCardUI";
import { findMedicAction } from "@/app/(auth)/plan/[planId]/actions";
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
  const [{ data: medicament, isLoading, isSuccess, isError }, findMedic] =
    useAsyncCallback(findMedicAction);

  useEffect(() => {
    if (medicamentData === undefined && !isLoading && !isSuccess && !isError) {
      void findMedic({ medicId: medicamentId });
    }
  }, [isError, findMedic, isLoading, isSuccess, medicamentData, medicamentId]);

  if (!medicamentData && ((!isSuccess && !isError) || isLoading)) {
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
