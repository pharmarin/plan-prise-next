import Link from "next/link";
import { routes } from "@/app/routes-schema";
import { Navigation } from "@/app/state-navigation";
import { AreaChart, Card, Metric, Text } from "@tremor/react";

import prisma from "@plan-prise/db-prisma";

const AdminDashboard = async () => {
  const usersCount = await prisma.user.count();
  const usersData: { month: number; count: bigint }[] =
    await prisma.$queryRaw`SELECT
      TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') AS month,
        COUNT(*) AS count
      FROM
        users
      WHERE
        "createdAt" >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY
        month
      ORDER BY
        month ASC;`;

  const plansCount = await prisma.plan.count();
  const plansData: { month: number; count: bigint }[] =
    await prisma.$queryRaw`SELECT
      TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') AS month,
        COUNT(*) AS count
      FROM
        plans
      WHERE
        "createdAt" >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY
        month
      ORDER BY
        month ASC;`;

  return (
    <>
      <Navigation title="Administration" />
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Link href={routes.users()}>
            <Card className="h-full" decoration="top" decorationColor="blue">
              <Text>Utilisateurs</Text>
              <Metric>{usersCount}</Metric>
            </Card>
          </Link>
          <Card className="col-span-2">
            <AreaChart
              className="h-44"
              colors={["blue"]}
              data={usersData.map((data) => ({
                month: data.month,
                count: Number(data.count),
              }))}
              index="month"
              categories={["count"]}
              showLegend={false}
            />
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card decoration="top" decorationColor="pink">
            <Text>Plans de prise</Text>
            <Metric>{plansCount}</Metric>
          </Card>
          <Card className="col-span-2">
            <AreaChart
              className="h-44"
              colors={["pink"]}
              data={plansData.map((data) => ({
                month: data.month,
                count: Number(data.count),
              }))}
              index="month"
              categories={["count"]}
              showLegend={false}
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
