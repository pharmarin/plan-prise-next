import PlanClient from "@/app/(auth)/plan/[id]/PlanClient";
import Navigation from "@/components/navigation/Navigation";
import { getServerSession } from "@/next-auth/get-session";
import prisma from "@/prisma";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

const Plan = async ({ params }: Props) => {
  const session = await getServerSession();
  const plan = await prisma.plan.findFirst({
    where: { id: params.id, user: { id: session?.user.id } },
    include: {
      medics: true,
    },
  });

  if (!plan) {
    // TODO: Check if working
    return notFound();
  }

  return (
    <>
      <Navigation title={`Plan de prise n°${params.id}`} />
      <PlanClient plan={plan} />
    </>
  );
};
export default Plan;

export const generateMetadata = ({ params }: Props) => ({
  title: `Plan de prise n°${params.id}`,
});