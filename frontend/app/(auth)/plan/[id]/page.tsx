import PlanCard from "@/app/(auth)/plan/[id]/PlanCard";
import Navigation from "@/components/navigation/Navigation";
import { getServerSession } from "@/next-auth/get-session";
import prisma from "@/prisma";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

const Plan = async ({ params }: Props) => {
  const session = await getServerSession();
  const plan = await prisma.plan.findFirst({
    where: { id: params.id, user: { is: { id: session?.user.id } } },
    include: {
      medics: {
        include: {
          commentaires: true,
          principesActifs: true,
        },
      },
    },
  });

  if (!plan) {
    // TODO: Check if working
    return notFound();
  }

  return (
    <>
      <Navigation title={`Plan de prise n°${params.id}`} />
      <div className="space-y-4">
        {plan.medics.map((row) => (
          <PlanCard
            key={`plan_${plan.id}_${row.id}`}
            medicament={row}
            data={plan.dataParsed?.[row.id] || {}}
            data-superjson
          />
        ))}
      </div>
      <p className="font-mono">{JSON.stringify(plan.medics[0])}</p>
    </>
  );
};
export default Plan;

export const generateMetadata = ({ params }: Props) => ({
  title: `Plan de prise n°${params.id}`,
});
