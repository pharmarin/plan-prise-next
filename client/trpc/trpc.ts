import { type ContextType } from "@/trpc/context";
import PP_Error from "@/utils/errors";
import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";

const tRPC = initTRPC.context<ContextType>().create({
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
  transformer: SuperJSON,
});

export const router = tRPC.router;

export const middleware = tRPC.middleware;

export const guestProcedure = tRPC.procedure;

export const authProcedure = tRPC.procedure.use((opts) => {
  if (!opts.ctx.user) {
    throw new PP_Error("UNAUTHORIZED_AUTH").toTRPCError();
  }

  return opts.next({
    ctx: {
      user: opts.ctx.user,
    },
  });
});

export const adminProcedure = authProcedure.use((opts) => {
  if (!opts.ctx.user.admin) {
    throw new PP_Error("UNAUTHORIZED_ADMIN").toTRPCError();
  }

  return opts.next();
});
