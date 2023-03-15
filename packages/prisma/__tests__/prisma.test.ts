import prisma from "../index";

describe("connexion", () => {
  it("should connect to database", () => {
    expect(prisma.$connect()).resolves.toBeUndefined();
  });
});

export {};
