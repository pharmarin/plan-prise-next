import Link from "next/link";
import Card from "@/components/Card";

import prisma from "@plan-prise/db-prisma";

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
