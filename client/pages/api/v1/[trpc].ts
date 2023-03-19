import { createContext } from "@/trpc/context";
import { appRouter } from "@/trpc/routers/app";
import { createNextApiHandler } from "@trpc/server/adapters/next";

// export API handler
// @see https://trpc.io/docs/api-handler
export default createNextApiHandler({
  createContext,
  router: appRouter,
});
