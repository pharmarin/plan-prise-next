import { type User as PrismaUser } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: Pick<PrismaUser, "id" | "admin">;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends Omit<PrismaUser, "password" | "updatedAt"> {}
}

declare module "next-auth/jwt" {
  interface JWT {
    user: Pick<PrismaUser, "id" | "admin">;
  }
}
