import prisma from "@/prisma";
import { expect, test } from "@playwright/test";

test.describe("database", () => {
  test("should connect to database", async () => {
    await expect(prisma.$connect()).resolves.not.toThrow();
  });

  test("should query database successfully", async () => {
    await expect(prisma.$queryRaw`SELECT "success"`).resolves.toStrictEqual([
      { ":vtg1": "success" },
    ]);
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });
});

export {};
