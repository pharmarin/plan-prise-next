import medicsRouter from "./routers/medics";
import planRouter from "./routers/plan";
import testsRouter from "./routers/tests";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  medics: medicsRouter,
  plan: planRouter,
  tests: testsRouter,
});

export type AppRouter = typeof appRouter;
