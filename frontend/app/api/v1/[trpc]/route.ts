import { createContext } from "@/trpc/context";
import { appRouter } from "@/trpc/routers/app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/v1",
    req,
    router: appRouter,
    createContext,
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

export { handler as GET, handler as POST };
