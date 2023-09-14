import medicsRouter from "@/trpc/routers/medics";
import planRouter from "@/trpc/routers/plan";
import usersRouter from "@/trpc/routers/users";
import { router } from "@/trpc/trpc";
import testsRouter from "./tests";

export const appRouter = router({
  medics: medicsRouter,
  plan: planRouter,
  tests: testsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
