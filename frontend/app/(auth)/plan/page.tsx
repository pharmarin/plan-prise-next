import Link from "@/components/navigation/Link";
import Navigation from "@/components/navigation/Navigation";
import { getServerSession } from "@/next-auth/get-session";
import { PlusIcon } from "@heroicons/react/20/solid";

import prisma from "@plan-prise/db-prisma";

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
      <Navigation title="Vos plan de prise" />
      <div className="flex justify-center">
        <div className="grid grid-cols-8 gap-4">
          <Link
            href="/plan/new"
            className="flex aspect-square w-32 items-center justify-center rounded-lg shadow-lg"
          >
            <span className="text-2xl">
              <PlusIcon className="h-10 w-10 stroke-teal-500 text-teal-500" />
            </span>
          </Link>
          {plans.map((plan) => (
            <Link
              key={plan.displayId}
              href={`/plan/${plan.displayId}`}
              className="flex aspect-square w-32 items-center justify-center rounded-lg shadow-lg"
            >
              <span className="text-2xl font-semibold">{plan.displayId}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
export default PlansIndex;
