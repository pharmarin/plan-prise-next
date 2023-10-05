import type { PlanInclude } from "@/types/plan";
import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";
import { isEqual, sortBy } from "lodash";

const extendedClient = () => {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  return prisma.$extends({
    query: {
      $allModels: {
        async create({ args, query }) {
          if ("data" in args && args.data) {
            args.data.id = createId();
          }

          return query(args);
        },
        async createMany({ args, query }) {
          if (Array.isArray(args.data)) {
            args.data.map((user) => (user.id = createId()));
          } else {
            args.data.id = createId();
          }

          return query(args);
        },
      },
    },
    result: {
      plan: {
        medicsIdSorted: {
          needs: { medicsOrder: true },
          compute: (plan) => {
            const medicsId = (plan as unknown as PlanInclude).medics.map(
              (medic) => medic.id,
            );

            if (
              Array.isArray(plan.medicsOrder) &&
              isEqual(sortBy(plan.medicsOrder), sortBy(medicsId))
            ) {
              return plan.medicsOrder as string[];
            }

            return medicsId;
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
