import PlanCardHeader from "@/app/(auth)/plan/[id]/PlanCardHeader";

const PlanCard = async (/* { data: medic }: { data: PlanData[0] } */) => {
  /* if (!id) {
    // TODO: Custom medic
    return null;
  } */

  /* const medic = await prisma.medics_simple.findUnique({
    where: { id: Number(id) },
  }); */

  return (
    <div className="rounded-lg p-4 shadow-md">
      <PlanCardHeader />
    </div>
  );
};
export default PlanCard;
