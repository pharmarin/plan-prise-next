import Link from "@/components/navigation/Link";
import { getServerSession } from "@/next-auth/get-session";
import prisma from "@/prisma";

const PlansIndex = async () => {
  const session = await getServerSession();
  const plans = await prisma.plans_old.findMany({
    where: {
      user: session?.user.id,
    },
    select: { id: true },
  });

  return (
    <div className="flex flex-col">
      {plans.map((plan) => (
        <Link key={plan.id} href={`/plan/${plan.id}`}>
          {plan.id}
        </Link>
      ))}
    </div>
  );
};
export default PlansIndex;
