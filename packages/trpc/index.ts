import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

import { type AppRouter } from "./src/routers/app";

export { TRPCError } from "@trpc/server";
export { type TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
export { createContext, type ContextType } from "./src/context";
export { appRouter, type AppRouter } from "./src/routers/app";

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
