import authRouter from "@/trpc/routers/auth";
import usersRouter from "@/trpc/routers/users";
import { router } from "@/trpc/trpc";

export const appRouter = router({
  auth: authRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
