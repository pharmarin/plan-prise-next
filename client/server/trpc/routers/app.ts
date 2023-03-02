import authRouter from "@/server/trpc/routers/auth";
import usersRouter from "@/server/trpc/routers/users";
import { router } from "@/server/trpc/trpc";

export const appRouter = router({
  auth: authRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
