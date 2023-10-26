import { NEXT_AUTH_PAGES } from "@/next-auth/config";
import prisma from "@/prisma";
import { type UserSafe } from "@/prisma/types";
import checkRecaptcha from "@/utils/check-recaptcha";
import PP_Error from "@/utils/errors";
import { checkPassword } from "@/utils/password-utils";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { PrismaClient } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import { type NextAuthOptions } from "node_modules/next-auth";

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient),
  callbacks: {
    jwt: ({ token, user }) => {
      if (user && user.approvedAt) {
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
          checkPassword(
            credentials.password,
            user.password.replace(/^\$2y/, "$2a"),
          )
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
