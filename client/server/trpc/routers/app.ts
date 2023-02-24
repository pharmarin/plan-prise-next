import authRouter from "server/trpc/routers/auth";
import { router } from "server/trpc/trpc";

export const appRouter = router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
