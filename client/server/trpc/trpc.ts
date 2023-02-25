import { initTRPC, TRPCError } from "@trpc/server";
import { ContextType } from "server/trpc/context";
import { setLocale } from "yup";
import { fr } from "yup-locales";

setLocale(fr);

const tRPC = initTRPC.context<ContextType>().create();

export const router = tRPC.router;

export const middleware = tRPC.middleware;

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

export const adminProcedure = authProcedure.use((opts) => {
  if (!opts.ctx.user.admin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Vous devez être administrateur pour effectuer cette action. ",
    });
  }

  return opts.next();
});
