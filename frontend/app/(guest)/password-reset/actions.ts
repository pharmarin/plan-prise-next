"use server";

import { guestAction } from "@/app/_safe-actions/safe-actions";
import { resetPasswordSchema } from "@/app/(guest)/password-reset/validation";

import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import { verifyJWT } from "@plan-prise/api/utils/json-web-token";
import { hashPassword } from "@plan-prise/auth/lib/password-utils";
import prisma from "@plan-prise/db-prisma";
import PP_Error from "@plan-prise/errors";

export const resetPasswordAction = guestAction
  .schema(resetPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    try {
      const { payload } = await verifyJWT(token);

      if (payload?.user_id && typeof payload.user_id === "string") {
        await prisma.user.update({
          where: { id: payload.user_id },
          data: { password: await hashPassword(password) },
        });

        return MUTATION_SUCCESS;
      }

      throw new Error();
    } catch (error) {
      throw new PP_Error("SERVER_ERROR");
    }
  });
