import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";

export { exclude } from "./exclude";
export * from "./types";

export * from "@prisma/client";

const extendedClient = () => {
  const prisma = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? [
            "error",
            "warn",
            ...(process.env.PRISMA_LOG === "true" ? (["query"] as const) : []),
          ]
        : ["error"],
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
