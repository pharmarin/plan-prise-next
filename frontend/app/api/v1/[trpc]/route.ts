import { createContext } from "@/trpc/context";
import { appRouter } from "@/trpc/routers/app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/v1",
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
