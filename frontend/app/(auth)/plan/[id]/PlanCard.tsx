import PlanCardBody from "@/app/(auth)/plan/[id]/PlanCardBody";
import PlanCardHeader from "@/app/(auth)/plan/[id]/PlanCardHeader";
import PlanCardUI from "@/app/(auth)/plan/[id]/_ui/PlanCardUI";
import { trpc } from "@/trpc/client";
import type { MedicamentIdentifier } from "@/types/medicament";

const PlanCard = ({
  medicamentId,
  removeMedic,
}: {
  medicamentId: string;
  removeMedic: (medicament: MedicamentIdentifier) => void;
}) => {
  const [medicament] = trpc.medics.unique.useSuspenseQuery(medicamentId);

  return (
    <PlanCardUI>
      <PlanCardHeader medicament={medicament} removeMedic={removeMedic} />
      <PlanCardBody medicament={medicament} />
    </PlanCardUI>
  );
};

export default PlanCard;
