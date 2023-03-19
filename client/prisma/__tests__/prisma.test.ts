import prisma from "@/prisma/client";

describe("connexion", () => {
  it("should connect to database", () => {
    expect(prisma.$connect()).resolves.toBeUndefined();
  });
});

export {};
