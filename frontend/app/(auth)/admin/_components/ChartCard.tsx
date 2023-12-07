import prisma from "@plan-prise/db-prisma";
import Card from "@plan-prise/ui/components/Card";
import Chart from "@plan-prise/ui/components/Chart";

const ChartCard = async ({ type }: { type: "users" | "plans" }) => {
  const data: { month: number; count: bigint }[] =
    type === "plans"
      ? await prisma.$queryRaw`SELECT
      DATE_FORMAT(TIME, '%Y-%m') AS month,
      COUNT(*) AS count
    FROM
      plans_old
    WHERE
      TIME >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY
      month
    ORDER BY
      month ASC;`
      : await prisma.$queryRaw`SELECT
      DATE_FORMAT(createdAt, '%Y-%m') AS month,
      COUNT(*) AS count
    FROM
      users
    WHERE
      createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY
      month
    ORDER BY
      month ASC;`;

  return (
    <Card className="col-span-2 flex h-44 items-center justify-center">
      <Chart
        color={type === "plans" ? "pink" : "blue"}
        data={data.map((month) => Number(month.count))}
        labels={data.map((month) => month.month)}
      />
    </Card>
  );
};
export default ChartCard;
