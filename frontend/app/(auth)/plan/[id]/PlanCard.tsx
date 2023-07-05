import PlanCardHeader from "@/app/(auth)/plan/[id]/PlanCardHeader";
import type { PlanData } from "@/app/(auth)/plan/[id]/types";

const PlanCard = async ({ data: medic }: { data: PlanData[0] }) => {
  /* if (!id) {
    // TODO: Custom medic
    return null;
  } */

  /* const medic = await prisma.medics_simple.findUnique({
    where: { id: Number(id) },
  }); */

  return (
    <div className="rounded-lg p-4 shadow-md">
      <PlanCardHeader
        nomGenerique={medic.nomGenerique}
        nomMedicament={medic.nomMedicament}
        voieAdministration={medic.voieAdministration}
      />
    </div>
  );
};
export default PlanCard;
