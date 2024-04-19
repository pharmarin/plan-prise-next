import type { SafeAction } from "next-safe-action";
import { createSafeActionClient } from "next-safe-action";
import type { Schema } from "zod";

import { getServerSession } from "@plan-prise/auth/get-session";
import PP_Error from "@plan-prise/errors";

export const guestAction = createSafeActionClient();

export const authAction = createSafeActionClient({
  middleware: async () => {
    const session = await getServerSession();

    if (session?.user) {
      return { userId: session?.user?.id };
    }

    throw new PP_Error("UNAUTHORIZED_AUTH");
  },
});

export const adminAction = createSafeActionClient({
  middleware: async () => {
    const session = await getServerSession();

    if (session?.user?.admin) {
      return { userId: session?.user?.id };
    }

    throw new PP_Error("UNAUTHORIZED_ADMIN");
  },
});

export const transformResponse = <S extends Schema, Data>(
  response?: Awaited<ReturnType<SafeAction<S, Data>>>,
) => {
  if (!response) {
    return;
  }

  if (response?.serverError) {
    throw new Error(
      response.serverError ?? "Server action failed without error",
    );
  }

  if (response?.validationErrors) {
    throw new Error("Error validating action");
  }

  return response?.data as Data;
};
