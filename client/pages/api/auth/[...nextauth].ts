import { nextAuthOptions } from "@/next-auth/options";
import { type UserSafe, type UserSession } from "@/prisma/types";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: UserSession;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends UserSafe {}
}

declare module "next-auth/jwt" {
  interface JWT {
    user: UserSession;
  }
}

export default NextAuth(nextAuthOptions);
