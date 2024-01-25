import { notFound } from "next/navigation";
import PlanClient from "@/app/(auth)/plan/_components/PlanClient";
import { Navigation } from "@/app/state-navigation";

import { getServerSession } from "@plan-prise/auth/get-session";
import prisma from "@plan-prise/db-prisma";

type Props = {
  params: { id: string };
};

const Plan = async ({ params }: Props) => {
  const session = await getServerSession();

  try {
    const plan = await prisma.plan.findFirstOrThrow({
      where: { displayId: Number(params.id), user: { id: session?.user.id } },
      include: {
        medics: {
          include: { commentaires: true, principesActifs: true },
        },
      },
    });

    return (
      <>
        <Navigation
          title={`Plan de prise n°${plan.displayId}`}
          returnTo="/plan"
        />
        <PlanClient plan={plan} data-superjson />
      </>
    );
  } catch (error) {
    notFound();
  }
};
export default Plan;

export const metadata = {
  title: "Plan de prise",
};
