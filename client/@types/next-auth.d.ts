import { User as PrismaUser } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: Pick<PrismaUser, "email" | "firstName" | "lastName">;
  }

  interface User extends PrismaUser {}
}
