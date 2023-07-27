import medicsRouter from "@/trpc/routers/medics";
import usersRouter from "@/trpc/routers/users";
import { router } from "@/trpc/trpc";
import testsRouter from "./tests";

export const appRouter = router({
  medics: medicsRouter,
  tests: testsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
