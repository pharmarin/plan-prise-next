import type {
  BindArgsValidationErrors,
  SafeActionResult,
  ValidationErrors,
} from "next-safe-action";
import { createSafeActionClient } from "next-safe-action";
import type { Schema } from "zod";

import { getServerSession } from "@plan-prise/auth/get-session";
import PP_Error from "@plan-prise/errors";

export const guestAction = createSafeActionClient();

export const authAction = createSafeActionClient().use(async ({ next }) => {
  const session = await getServerSession();

  if (session?.user) {
    return next({ ctx: { userId: session?.user?.id } });
  }

  throw new PP_Error("UNAUTHORIZED_AUTH");
});

export const adminAction = createSafeActionClient().use(async ({ next }) => {
  const session = await getServerSession();

  if (session?.user?.admin) {
    return next({ ctx: { userId: session?.user?.id } });
  }

  throw new PP_Error("UNAUTHORIZED_ADMIN");
});

export const transformResponse = <
  S extends Schema,
  Data,
  BAS extends readonly Schema[],
  ServerError,
  Context extends readonly Schema[],
  CVE extends ValidationErrors<S>,
  CBAVE extends BindArgsValidationErrors<BAS>,
>(
  response?: SafeActionResult<ServerError, S, BAS, CVE, CBAVE, Data, Context>,
) => {
  if (!response) {
    return;
  }

  if (response?.serverError) {
    throw new Error(
      (response.serverError as string) ?? "Server action failed without error",
    );
  }

  if (response?.validationErrors) {
    throw new Error("Error validating action");
  }

  return response?.data as Data;
};
