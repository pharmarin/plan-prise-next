import prisma from "@/prisma";

describe("connexion", () => {
  it("should connect to database", () => {
    expect(prisma.$connect()).resolves.toBeUndefined();
  });

  afterAll(() => {
    prisma.$disconnect();
  });
});

export {};
