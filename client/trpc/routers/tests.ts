import { authProcedure, guestProcedure, router } from "@/trpc/trpc";

const testsRouter = router({
  guestQuery: guestProcedure.query(() => "success"),
  authQuery: authProcedure.query(() => "success")
})

export default testsRouter;