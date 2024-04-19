import { routes } from "@/app/routes-schema";
import { Navigation } from "@/app/state-navigation";

import { getServerSession } from "@plan-prise/auth/get-session";
import prisma from "@plan-prise/db-prisma";
import ModuleIndex from "@plan-prise/ui/components/module-index";

const PlansIndex = async () => {
  const session = await getServerSession();

  const plans = await prisma.plan.findMany({
    where: {
      user: {
        id: session?.user.id,
      },
    },
    select: { displayId: true },
    orderBy: { displayId: "asc" },
  });

  return (
    <>
      <Navigation title="Vos plans de prise" />
      <ModuleIndex
        itemRoute={(item) => routes.plan({ planId: item })}
        items={plans.map((plan) => plan.displayId)}
        newRoute={routes.planCreate()}
        testId={{ tile: "plan-index-tile" }}
      />
    </>
  );
};
export default PlansIndex;
