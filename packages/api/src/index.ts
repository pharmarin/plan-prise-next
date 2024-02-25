import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./root";

export { appRouter, type AppRouter } from "./root";
export { createCallerFactory, createTRPCContext } from "./trpc";

export {
  formatDisplayName,
  formatFirstName,
  formatLastName,
  sendMailApproved,
  sendMailRegistered,
  sendMailReinitPassword,
} from "./routers/users";

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
