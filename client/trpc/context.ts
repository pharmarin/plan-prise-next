import { getServerSession } from "@/next-auth/get-session";
import prisma from "@/prisma";
import type { UserSession } from "@/prisma/types";
import type * as trpc from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";

export const createContext = async (ctx: trpcNext.CreateNextContextOptions) => {
  const session = await getServerSession(ctx);

  return { ...ctx, prisma, user: session?.user as UserSession | undefined };
};

export type ContextType = trpc.inferAsyncReturnType<typeof createContext>;
