import type { PlanInclude } from "@/types/plan";
import { PrismaClient } from "@prisma/client";
import { isEqual, sortBy } from "lodash";

const extendedClient = () => {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  return prisma.$extends({
    result: {
      plan: {
        medicsIdSorted: {
          needs: { medicsOrder: true },
          compute: (plan) => {
            const medicsId = (plan as unknown as PlanInclude).medics.map(
              (medic) => medic.id,
            );

            if (
              !Array.isArray(plan.medicsOrder) ||
              isEqual(sortBy(plan.medicsOrder), sortBy(medicsId))
            ) {
              return medicsId;
            }

            return plan.medicsOrder as string[];
          },
        },
      },
    },
  });
};

type ExtendedPrismaClient = ReturnType<typeof extendedClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient;
};

const prisma = globalForPrisma.prisma || extendedClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
