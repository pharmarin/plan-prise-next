export * from "@prisma/client";

import { PrismaClient, type User } from "@prisma/client";

declare global {
  let prisma: PrismaClient;
}

export type UserSafe = Omit<User, "password">;
export type UserSession = Pick<User, "admin" | "id">;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
