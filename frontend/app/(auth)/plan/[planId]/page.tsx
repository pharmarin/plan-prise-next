import { notFound } from "next/navigation";
import PlanClient from "@/app/(auth)/plan/_components/PlanClient";
import { routes } from "@/app/routes-schema";
import { Navigation } from "@/app/state-navigation";

import { getServerSession } from "@plan-prise/auth/get-session";
import prisma from "@plan-prise/db-prisma";

const Plan = async ({ params }: { params: unknown }) => {
  try {
    const { planId } = routes.plan.$parseParams(params);

    const session = await getServerSession();

    const plan = await prisma.plan.findFirstOrThrow({
      where: { displayId: Number(planId), user: { id: session?.user.id } },
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
          returnTo={routes.plans()}
        />
        <PlanClient plan={plan} data-superjson />
      </>
    );
  } catch (error) {
    error instanceof Error && console.error("error: ", error.message);
    notFound();
  }
};
export default Plan;

export const metadata = {
  title: "Plan de prise",
};
