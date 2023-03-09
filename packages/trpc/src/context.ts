import prisma, { type UserSession } from "@plan-prise/prisma";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
// TODO: Change to @plan-prise/auth
import { getSession } from "next-auth/react";

export const createContext = async (ctx: CreateNextContextOptions) => {
  const { req, res } = ctx;

  const session = await getSession({ req: req });

  return {
    req,
    res,
    prisma,
    user: session?.user as UserSession | undefined,
  };
};

export type ContextType = inferAsyncReturnType<typeof createContext>;
