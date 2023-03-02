import { createContext } from "@/server/trpc/context";
import { appRouter } from "@/server/trpc/routers/app";
import * as trpcNext from "@trpc/server/adapters/next";

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
  createContext,
  router: appRouter,
});
