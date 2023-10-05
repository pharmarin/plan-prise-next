import PlanClient from "@/app/(auth)/plan/[id]/PlanClient";
import Navigation from "@/components/navigation/Navigation";
import { getServerSession } from "@/next-auth/get-session";
import prisma from "@/prisma";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

const Plan = async ({ params }: Props) => {
  const session = await getServerSession();

  const plan = await prisma.plan.findFirst({
    where: { displayId: Number(params.id), user: { id: session?.user.id } },
    include: {
      medics: {
        include: { commentaires: true, principesActifs: true },
      },
    },
  });

  if (!plan) {
    // TODO: Check if working
    return notFound();
  }

  return (
    <>
      <Navigation
        title={`Plan de prise n°${plan.displayId}`}
        returnTo="/plan"
      />
      <PlanClient plan={plan} data-superjson />
    </>
  );
};
export default Plan;

export const metadata = {
  title: "Plan de prise",
};
