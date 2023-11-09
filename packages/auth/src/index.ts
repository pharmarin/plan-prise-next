import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { PrismaClient } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import prisma from "@plan-prise/db-prisma";
import PP_Error from "@plan-prise/errors";

import { NEXT_AUTH_PAGES } from "./config";
import checkRecaptcha from "./lib/check-recaptcha";
import { checkPassword } from "./lib/password-utils";
import type { UserSafe, UserSession } from "./types";

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

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient),
  callbacks: {
    jwt: ({ token, user }) => {
      if (user?.approvedAt) {
        if (!token.user) {
          token.user = {
            id: user.id,
            admin: user.admin,
            displayName: user.displayName,
            lastName: user.lastName,
            firstName: user.firstName,
          };
        }
      }

      return token;
    },
    session: ({ session, user, token }) => {
      if (!user && !token?.user) {
        return session;
      }

      session.user.id = token?.user?.id ?? user.id;
      session.user.admin = token?.user?.admin ?? user.admin;
      session.user.displayName = token?.user?.displayName ?? user.displayName;
      session.user.firstName = token?.user?.firstName ?? user.firstName;
      session.user.lastName = token?.user?.lastName ?? user.lastName;

      return session;
    },
  },
  pages: NEXT_AUTH_PAGES,
  providers: [
    Credentials({
      authorize: async (credentials): Promise<UserSafe | null> => {
        if (
          !credentials?.email ||
          !credentials.password ||
          !credentials.recaptcha
        ) {
          return null;
        }

        const recaptcha = await checkRecaptcha(credentials.recaptcha);

        if (!recaptcha) {
          throw new PP_Error("RECAPTCHA_LOADING_ERROR");
        }

        if (recaptcha <= 0.5) {
          throw new PP_Error("RECAPTCHA_VALIDATION_ERROR");
        }

        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && !user.approvedAt) {
          throw new PP_Error("USER_NOT_APPROVED");
        }

        if (
          user &&
          (await checkPassword(
            credentials.password,
            user.password.replace(/^\$2y/, "$2a"),
          ))
        ) {
          const { password: _password, ...sessionUser } = user;

          // Credentials match with records
          // Returning user without password field
          return sessionUser;
        }

        return null;
      },
      credentials: {
        email: {
          label: "Adresse mail",
          type: "mail",
          placeholder: "Adresse mail",
        },
        password: {
          label: "Mot de passe",
          type: "password",
          placeholder: "Mot de passe",
        },
        recaptcha: {
          type: "hidden",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const handler = NextAuth(nextAuthOptions);
