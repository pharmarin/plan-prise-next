import Navigation from "@/components/navigation/Navigation";
import { getServerSession } from "@/next-auth/get-session";
import prisma from "@/prisma";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

type PlanData = { id: string; nomMedicament: string }[];

const Plan = async ({ params }: Props) => {
  const session = await getServerSession();
  const plan = await prisma.plans_old
    .findFirst({
      where: { id: Number(params.id), user: session?.user.id },
    })
    .then((plan) => ({
      ...plan,
      data: plan?.data ? (JSON.parse(plan.data) as PlanData) : null,
      options: plan?.options ? JSON.parse(plan.options) : null,
    }));

  if (!plan) {
    return notFound();
  }

  return (
    <>
      <Navigation title={`Plan de prise n°${params.id}`} />
      <div>
        {(plan.data || []).map((row) => (
          <div key={row.id}>{row.nomMedicament}</div>
        ))}
      </div>
      <p className="font-mono">{JSON.stringify(plan?.data)}</p>
    </>
  );
};
export default Plan;

export const generateMetadata = ({ params }: Props) => ({
  title: `Plan de prise n°${params.id}`,
});
