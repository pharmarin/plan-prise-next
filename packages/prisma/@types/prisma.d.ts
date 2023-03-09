import { type PrismaClient } from "@prisma/client";

export declare global {
  let prisma: PrismaClient;
}
