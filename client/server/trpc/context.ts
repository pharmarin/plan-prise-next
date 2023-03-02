import prisma from "@/server/prisma/client";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";

export const createContext = async (ctx: trpcNext.CreateNextContextOptions) => {
  const { req, res } = ctx;

  const session = await getSession({ req: req });

  return {
    req,
    res,
    prisma,
    user: session?.user,
  };
};

export type ContextType = trpc.inferAsyncReturnType<typeof createContext>;
