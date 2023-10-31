import { nextAuthOptions } from "@/next-auth/options";
import type { UserSafe, UserSession } from "@/prisma/types";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: UserSession;
  }

  interface User extends UserSafe {}
}

declare module "next-auth/jwt" {
  interface JWT {
    user: UserSession;
  }
}

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
