import Link from "next/link";

import prisma from "@plan-prise/db-prisma";
import Card from "@plan-prise/ui/components/Card";

const PlansCountCard = async () => {
  const count = await prisma.plans_old.count();

  return (
    <Link href="/admin/users">
      <Card className="flex h-44 flex-col justify-center text-center">
        <span className="text-6xl text-pink-700">{count}</span>
        <span className="text-3xl text-pink-500">Plans de prise créés</span>
      </Card>
    </Link>
  );
};

export default PlansCountCard;
