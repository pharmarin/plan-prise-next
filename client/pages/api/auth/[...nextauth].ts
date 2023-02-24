import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import UserNotApproved from "common/errors/UserNotApproved";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "server/prisma/client";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user && user.email) {
        if (!token.user) {
          token.user = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            admin: user.admin,
          };
        }
      }

      return token;
    },
    session: ({ session, user, token }) => {
      if (token && token.user) {
        session.user.firstName = token.user.firstName;
        session.user.lastName = token.user.lastName;
        session.user.admin = token.user.admin;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  providers: [
    Credentials({
      authorize: async (credentials, req) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && !user.approvedAt) {
          throw new UserNotApproved();
        }

        if (
          user &&
          bcrypt.compareSync(
            credentials.password,
            user.password.replace(/^\$2y/, "$2a")
          )
        ) {
          // Credentials match with records
          // Returning user
          return user;
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
      },
    }),
  ],
  session: { strategy: "jwt" },
});
