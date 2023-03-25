import usersRouter from "@/trpc/routers/users";
import { router } from "@/trpc/trpc";

export const appRouter = router({
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
