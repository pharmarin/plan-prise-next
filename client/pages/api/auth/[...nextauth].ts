import checkRecaptcha from "@/common/check-recaptcha";
import ReCaptchaNotLoaded from "@/common/errors/ReCaptchaNotLoaded";
import ReCaptchaVerificationError from "@/common/errors/ReCaptchaVerificationError";
import UserNotApproved from "@/common/errors/UserNotApproved";
import prisma from "@/server/prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import NextAuth, { type AuthOptions, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const nextAuthOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: ({ token, user }) => {
      if (user && user.approvedAt) {
        if (!token.user) {
          token.user = {
            id: user.id,
            admin: user.admin,
          };
        }
      }

      return token;
    },
    session: ({ session, user, token }) => {
      session.user.id = token?.user?.id ?? user.id;
      session.user.admin = token?.user?.admin ?? user.admin;

      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  providers: [
    Credentials({
      authorize: async (credentials): Promise<User | null> => {
        if (
          !credentials?.email ||
          !credentials.password ||
          !credentials.recaptcha
        ) {
          return null;
        }

        const recaptcha = await checkRecaptcha(credentials.recaptcha);

        if (!recaptcha) {
          throw new ReCaptchaNotLoaded();
        }

        if (recaptcha <= 0.5) {
          throw new ReCaptchaVerificationError();
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

export default NextAuth(nextAuthOptions);
