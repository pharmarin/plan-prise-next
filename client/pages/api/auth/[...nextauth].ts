import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import checkRecaptcha from "common/check-recaptcha";
import ReCaptchaNotLoaded from "common/errors/ReCaptchaNotLoaded";
import ReCaptchaVerificationError from "common/errors/ReCaptchaVerificationError";
import UserNotApproved from "common/errors/UserNotApproved";
import NextAuth, { User } from "next-auth";
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
      session.user.firstName = token?.user?.firstName ?? user.firstName;
      session.user.lastName = token?.user?.lastName ?? user.lastName;
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
      authorize: async (credentials, req): Promise<User | null> => {
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
          const { password, ...sessionUser } = user;

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
});
