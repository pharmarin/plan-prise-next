import { getServerSession } from "@/next-auth/session";
import prisma from "@/prisma/client";
import { type UserSession } from "@/prisma/types";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

export const createContext = async (ctx: CreateNextContextOptions) => {
  const session = await getServerSession(ctx);

  return { ...ctx, prisma, user: session?.user as UserSession | undefined };
};

export type ContextType = inferAsyncReturnType<typeof createContext>;
