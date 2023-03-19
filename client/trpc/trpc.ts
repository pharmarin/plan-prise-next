import PP_Error from "@/utils/errors";
import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { type ContextType } from "./context";

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
    throw new TRPCError({
      code: "UNAUTHORIZED",
      cause: new PP_Error("UNAUTHORIZED_AUTH"),
    });
  }

  return opts.next({
    ctx: {
      user: opts.ctx.user,
    },
  });
});

export const adminProcedure = authProcedure.use((opts) => {
  if (!opts.ctx.user.admin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      cause: new PP_Error("UNAUTHORIZED_ADMIN"),
    });
  }

  return opts.next();
});
