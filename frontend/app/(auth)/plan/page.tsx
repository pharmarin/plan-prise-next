import Link from "@/components/navigation/Link";
import { getServerSession } from "@/next-auth/get-session";
import prisma from "@/prisma";

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
    <div className="flex flex-col">
      {plans.map((plan) => (
        <Link key={plan.displayId} href={`/plan/${plan.displayId}`}>
          {plan.displayId}
        </Link>
      ))}
    </div>
  );
};
export default PlansIndex;
