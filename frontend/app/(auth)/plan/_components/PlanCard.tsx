import PlanCardUI from "@/app/(auth)/plan/_components/_ui/PlanCardUI";
import PlanCardBody from "@/app/(auth)/plan/_components/PlanCardBody";
import PlanCardHeader from "@/app/(auth)/plan/_components/PlanCardHeader";
import PlanCardLoading from "@/app/(auth)/plan/_components/PlanCardLoading";
import { trpc } from "@/utils/api";

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
  const { data: medicament, isLoading } = trpc.medics.unique.useQuery(
    medicamentId,
    { enabled: medicamentData === undefined },
  );

  if (!medicamentData && !medicament) {
    if (isLoading) {
      return <PlanCardLoading type="fetching" />;
    } else {
      console.error(
        "Error rendering card for",
        medicamentData,
        medicament,
        isLoading,
      );
      throw new PP_Error("MEDICAMENT_LOADING_ERROR");
    }
  }

  if (!medicamentData && isLoading) {
    return <PlanCardLoading type="fetching" />;
  }

  if (!medicamentData || (!medicament && !isLoading)) {
    console.error(medicamentData, medicament, isLoading);
    throw new PP_Error("MEDICAMENT_LOADING_ERROR");
  }

  return (
    <PlanCardUI>
      <PlanCardHeader
        medicament={medicamentData ?? medicament}
        removeMedic={removeMedic}
      />
      <PlanCardBody medicament={medicamentData ?? medicament} />
    </PlanCardUI>
  );
};

export default PlanCard;
