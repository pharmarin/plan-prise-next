import prisma from "@/prisma";

describe("connexion", () => {
  it("should connect to database", () => {
    expect(prisma.$connect()).resolves.not.toThrow();
  });

  afterAll(() => {
    prisma.$disconnect();
  });
});

export {};
