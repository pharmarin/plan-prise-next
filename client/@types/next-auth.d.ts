import { User as PrismaUser } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: Pick<PrismaUser, "email" | "firstName" | "lastName" | "admin">;
  }

  interface User extends Omit<PrismaUser, "password" | "updatedAt"> {}
}

declare module "next-auth/jwt" {
  interface JWT {
    user: Pick<PrismaUser, "email" | "firstName" | "lastName" | "admin">;
  }
}
