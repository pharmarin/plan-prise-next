import type * as trpc from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { getServerSession } from "@plan-prise/auth/get-session";
import prisma from "@plan-prise/db-prisma";

export const createContext = async (ctx: FetchCreateContextFnOptions) => {
  const session = await getServerSession();

  return { ...ctx, prisma, user: session?.user };
};

export type ContextType = trpc.inferAsyncReturnType<typeof createContext>;
