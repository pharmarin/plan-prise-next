import usersRouter from "@/trpc/routers/users";
import { router } from "@/trpc/trpc";
import testsRouter from "./tests";

export const appRouter = router({
  tests: testsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
