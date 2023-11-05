import { expect, test } from "@playwright/test";

import prisma from "@plan-prise/db-prisma";

test.describe("database", () => {
  test("should connect to database", async () => {
    await expect(prisma.$connect()).resolves.not.toThrow();
  });

  test("should query database successfully", async () => {
    await expect(prisma.$queryRaw`SELECT "success"`).resolves.toStrictEqual([
      { ":vtg1 /* VARCHAR */": "success" },
    ]);
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });
});

export {};
