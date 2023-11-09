import { authProcedure, createTRPCRouter, publicProcedure, } from "../trpc";

const testsRouter = createTRPCRouter({
  guestQuery: publicProcedure.query(() => "success"),
  authQuery: authProcedure.query(() => "success")
})

export default testsRouter;