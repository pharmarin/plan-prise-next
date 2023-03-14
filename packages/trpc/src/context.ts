import { getServerSession } from "@plan-prise/next-auth";
import prisma, { type UserSession } from "@plan-prise/prisma";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

export const createContext = async (ctx: CreateNextContextOptions) => {
  const session = await getServerSession(ctx);

  return { ...ctx, prisma, user: session?.user as UserSession | undefined };
};

export type ContextType = inferAsyncReturnType<typeof createContext>;
