"use server";

import { guestAction } from "@/app/safe-actions";
import { z } from "zod";

import { sendMailReinitPassword } from "@plan-prise/api";
import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import { signJWT } from "@plan-prise/api/utils/json-web-token";
import checkRecaptcha from "@plan-prise/auth/lib/check-recaptcha";
import prisma from "@plan-prise/db-prisma";
import PP_Error from "@plan-prise/errors";

export const sendPasswordResetLinkAction = guestAction
  .schema(
    z.object({
      email: z.string().email(),
      recaptcha: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const recaptcha = await checkRecaptcha(parsedInput.recaptcha ?? "");

    if (!recaptcha) {
      throw new PP_Error("RECAPTCHA_LOADING_ERROR");
    }

    if (recaptcha <= 0.5) {
      throw new PP_Error("RECAPTCHA_VALIDATION_ERROR");
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { email: parsedInput.email },
    });

    const token = await signJWT({ user_id: user.id });

    await sendMailReinitPassword(user, token);

    return MUTATION_SUCCESS;
  });
