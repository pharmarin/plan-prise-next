import type { AppRouter } from "@/trpc/routers/app";
import { getTRPCUrl } from "@/utils/get-urls";
import { httpBatchLink, loggerLink } from "@trpc/client";
import {
  experimental_createActionHook,
  experimental_createTRPCNextAppDirClient,
  experimental_serverActionLink,
} from "@trpc/next/app-dir/client";
import SuperJSON from "superjson";

export const trpc = experimental_createTRPCNextAppDirClient<AppRouter>({
  config: () => ({
    links: [
      loggerLink({
        enabled: (op) =>
          process.env.NODE_ENV === "development" ||
          (op.direction === "down" && op.result instanceof Error),
      }),
      httpBatchLink({
        url: getTRPCUrl(),
        headers() {
          return {
            "x-trpc-source": "client",
          };
        },
      }),
    ],
    transformer: SuperJSON,
  }),
});

export const useAction = experimental_createActionHook({
  links: [loggerLink(), experimental_serverActionLink()],
  transformer: SuperJSON,
});
