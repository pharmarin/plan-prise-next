import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { Session } from "@plan-prise/auth";
import { getServerSession } from "@plan-prise/auth/get-session";
import prisma from "@plan-prise/db-prisma";
import PP_Error from "@plan-prise/errors";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
type CreateContextOptions = {
  session: Session | null;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: {
  req?: Request;
  auth?: Session | null;
}) => {
  const session = opts.auth ?? (await getServerSession());

  return createInnerTRPCContext({
    session,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter: ({ shape, error }) => {
    if (error.cause instanceof PP_Error) {
      return {
        ...shape,
        data: {
          ...shape.data,
          code: error.cause.code,
          message: error.cause.message,
          infos: error.cause.infos,
          type: "PP_Error",
        },
      };
    }

    return shape;
  },
  transformer: superjson,
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const authProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new PP_Error("UNAUTHORIZED_AUTH").toTRPCError();
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const adminProcedure = authProcedure.use(({ ctx, next }) => {
  if (!ctx.session?.user.admin) {
    throw new PP_Error("UNAUTHORIZED_ADMIN").toTRPCError();
  }

  return next();
});
