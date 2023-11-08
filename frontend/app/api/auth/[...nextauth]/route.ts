/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { nextAuthOptions } from "@/next-auth/options";
import type { UserSafe, UserSession } from "@/types/user";
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

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
