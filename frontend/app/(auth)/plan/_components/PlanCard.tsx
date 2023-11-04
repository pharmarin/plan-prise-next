import PlanCardUI from "@/app/(auth)/plan/_components/_ui/PlanCardUI";
import PlanCardBody from "@/app/(auth)/plan/_components/PlanCardBody";
import PlanCardHeader from "@/app/(auth)/plan/_components/PlanCardHeader";
import PlanCardLoading from "@/app/(auth)/plan/_components/PlanCardLoading";
import { trpc } from "@/trpc/client";
import type {
  MedicamentIdentifier,
  MedicamentInclude,
} from "@/types/medicament";
import PP_Error from "@/utils/errors";

const PlanCard = ({
  medicamentData,
  medicamentId,
  removeMedic,
}: {
  medicamentData?: MedicamentInclude;
  medicamentId: string;
  removeMedic: (medicament: MedicamentIdentifier) => void;
}) => {
  const { data: medicament, isLoading } = trpc.medics.unique.useQuery(
    medicamentId,
    { enabled: medicamentData === undefined },
  );

  if (!medicamentData && isLoading) {
    return <PlanCardLoading type="fetching" />;
  }

  if (!medicamentData && !medicament && !isLoading) {
    console.error(medicamentData, medicament, isLoading);
    throw new PP_Error("MEDICAMENT_LOADING_ERROR");
  }

  return (
    <PlanCardUI>
      <PlanCardHeader
        // @ts-expect-error unexpected
        medicament={medicamentData ?? medicament}
        removeMedic={removeMedic}
      />
      <PlanCardBody
        // @ts-expect-error unexpected
        medicament={medicamentData ?? medicament}
      />
    </PlanCardUI>
  );
};

export default PlanCard;
