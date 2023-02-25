import { initTRPC, TRPCError } from "@trpc/server";
import { ContextType } from "server/trpc/context";
import SuperJSON from "superjson";

const tRPC = initTRPC.context<ContextType>().create({
  transformer: SuperJSON,
});

export const router = tRPC.router;

export const guestProcedure = tRPC.procedure;

export const authProcedure = tRPC.procedure.use((opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Vous devez être connecté pour effectuer cette action. ",
    });
  }
  return opts.next({
    ctx: {
      user: opts.ctx.user,
    },
  });
});
