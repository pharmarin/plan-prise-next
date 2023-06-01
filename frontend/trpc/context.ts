import { getServerSession } from "@/next-auth/get-session";
import prisma from "@/prisma";
import type { UserSession } from "@/prisma/types";
import type * as trpc from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const createContext = async (ctx: FetchCreateContextFnOptions) => {
  const session = await getServerSession();

  return { prisma, user: session?.user as UserSession | undefined };
};

export type ContextType = trpc.inferAsyncReturnType<typeof createContext>;
