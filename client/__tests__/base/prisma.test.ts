import prisma from "@/prisma";
import { expect, test } from "@playwright/test";

test.describe("connexion", () => {
  test("should connect to database", async () => {
    await expect(prisma.$connect()).resolves.not.toThrow();
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });
});

export {};
