/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { db } from "@plan-prise/db-drizzle";
import PP_Error from "@plan-prise/errors";

import { NEXT_AUTH_PAGES } from "./config";
import checkRecaptcha from "./lib/check-recaptcha";
import { checkPassword } from "./lib/password-utils";
import type { UserSafe, UserSession } from "./types";

export type { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: UserSession;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends UserSafe {}
}

declare module "@auth/core" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends UserSafe {}
}

declare module "next-auth/jwt" {
  interface JWT {
    user: UserSession;
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
  recaptcha: z.string(),
});

export const nextAuthOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  callbacks: {
    jwt: ({ token, user }) => {
      if (user?.approvedAt) {
        token.user = {
          id: user.id,
          admin: user.admin,
          displayName: user.displayName,
          lastName: user.lastName,
          firstName: user.firstName,
        };
      }

      return token;
    },
    session: ({ session, user, token }) => ({
      ...session,
      user: token?.user
        ? token.user
        : {
            id: user.id,
            admin: user.admin,
            displayName: user.displayName,
            firstName: user.firstName,
            lastName: user.lastName,
          },
    }),
  },
  pages: NEXT_AUTH_PAGES,
  providers: [
    Credentials({
      authorize: async (credentials): Promise<UserSafe | null> => {
        const credentialsParsed = credentialsSchema.parse(credentials);

        const recaptcha = await checkRecaptcha(credentialsParsed.recaptcha);

        if (!recaptcha) {
          throw new PP_Error("RECAPTCHA_LOADING_ERROR");
        }

        if (recaptcha <= 0.5) {
          console.error("Recaptcha result too low: ", recaptcha);
          throw new PP_Error("RECAPTCHA_VALIDATION_ERROR");
        }

        // Add logic here to look up the user from the credentials supplied
        const user = await db.query.users.findFirst({
          where: (fields, { eq }) => eq(fields.email, credentialsParsed.email),
        });

        if (user && !user.approvedAt) {
          throw new PP_Error("USER_NOT_APPROVED");
        }

        if (
          user &&
          (await checkPassword(
            credentialsParsed.password,
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
