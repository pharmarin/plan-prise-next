import prisma from "@/prisma";

const PlanCard = async ({ id }: { id: string }) => {
  if (!id) {
    // TODO: Custom medic
    return null;
  }

  const medic = await prisma.medics_simple.findUnique({
    where: { id: Number(id) },
  });

  return (
    <div className="rounded-lg p-4 shadow-md">
      <div>
        <span className="text-lg font-bold">{medic?.nomMedicament}</span>
      </div>
    </div>
  );
};
export default PlanCard;
