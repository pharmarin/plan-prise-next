import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "prisma/client";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
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
      authorize: async (credentials, req) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

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
    }),
  ],
});
