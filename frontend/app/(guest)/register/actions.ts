"use server";

import { guestAction } from "@/app/_safe-actions/safe-actions";
import { registerSchema } from "@/app/(guest)/register/validation";
import { routes } from "@/app/routes-schema";
import { env } from "@/env.mjs";

import {
  formatDisplayName,
  formatFirstName,
  formatLastName,
  sendMailApproved,
  sendMailRegistered,
} from "@plan-prise/api";
import { findOne } from "@plan-prise/api-pharmaciens";
import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import getUrl from "@plan-prise/api/utils/url";
import checkRecaptcha from "@plan-prise/auth/lib/check-recaptcha";
import { hashPassword } from "@plan-prise/auth/lib/password-utils";
import prisma, { Prisma } from "@plan-prise/db-prisma";
import PP_Error from "@plan-prise/errors";

export const registerAction = guestAction(registerSchema, async (input) => {
  const recaptcha = await checkRecaptcha(input.recaptcha ?? "");

  if (!recaptcha) {
    throw new PP_Error("RECAPTCHA_LOADING_ERROR");
  }

  if (recaptcha <= 0.5) {
    throw new PP_Error("RECAPTCHA_VALIDATION_ERROR");
  }

  const firstName = formatFirstName(input.firstName);
  const lastName = formatLastName(input.lastName);
  const displayName = formatDisplayName(input.displayName);

  try {
    await prisma.user.create({
      data: {
        email: input.email,
        firstName,
        lastName,
        displayName,
        student: input.student ?? false,
        certificate:
          input.certificate && "data" in input.certificate
            ? input.certificate.data
            : undefined,
        rpps: input.rpps ? BigInt(input.rpps) : undefined,
        password: await hashPassword(input.password),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new PP_Error("USER_REGISTER_CONFLICT");
      }
    }

    console.error("Error registering: ", error);
    throw new PP_Error("USER_REGISTER_ERROR");
  }

  try {
    const userFromRPPS = findOne(Number(input.rpps));

    if (
      userFromRPPS &&
      lastName.toLowerCase() === userFromRPPS?.lastName.toLowerCase() &&
      firstName.toLowerCase() === userFromRPPS.firstName.toLowerCase()
    ) {
      await prisma.user.update({
        where: { email: input.email },
        data: { approvedAt: new Date() },
      });

      if (process.env.CI !== "true") {
        await sendMailApproved({ email: input.email, firstName, lastName });

        await fetch(env.NTFY_ADMIN_URL ?? "", {
          method: "POST",
          body: `${(
            await prisma.user.count({ where: { approvedAt: null } })
          ).toString()} en attente`,
          headers: {
            Tags: "+1",
            Title: `Nouvelle inscription approuvée automatiquement sur plandeprise.fr`,
          },
        });
      }
    } else {
      if (process.env.CI !== "true") {
        await sendMailRegistered({ email: input.email, firstName, lastName });
      }
    }
  } catch (error) {
    console.error("Error sending registration mail: ", error);

    throw new PP_Error("USER_REGISTER_WARNING");
  }

  try {
    if (process.env.CI !== "true") {
      await fetch(env.NTFY_ADMIN_URL ?? "", {
        method: "POST",
        body: `${(
          await prisma.user.count({ where: { approvedAt: null } })
        ).toString()} en attente`,
        headers: {
          Actions: `view, Approuver, ${getUrl(routes.users() as `/${string}`)}`,
          Click: getUrl("/admin/users"),
          Tags: "+1",
          Title: `Nouvelle inscription sur plandeprise.fr`,
        },
      });
    }
  } catch (error) {
    console.error("Error sending registration admin notification: ", error);
  }

  return MUTATION_SUCCESS;
});
