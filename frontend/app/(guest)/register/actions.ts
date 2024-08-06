"use server";

import { registerSchema } from "@/app/(guest)/register/validation";
import { routes } from "@/app/routes-schema";
import { guestAction } from "@/app/safe-actions";
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

export const registerAction = guestAction
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    const recaptcha = await checkRecaptcha(parsedInput.recaptcha ?? "");

    if (!recaptcha) {
      throw new PP_Error("RECAPTCHA_LOADING_ERROR");
    }

    if (recaptcha <= 0.5) {
      throw new PP_Error("RECAPTCHA_VALIDATION_ERROR");
    }

    const firstName = formatFirstName(parsedInput.firstName);
    const lastName = formatLastName(parsedInput.lastName);
    const displayName = formatDisplayName(parsedInput.displayName);

    try {
      await prisma.user.create({
        data: {
          email: parsedInput.email,
          firstName,
          lastName,
          displayName,
          student: parsedInput.student ?? false,
          certificate:
            parsedInput.certificate && "data" in parsedInput.certificate
              ? parsedInput.certificate.data
              : undefined,
          rpps: parsedInput.rpps ? BigInt(parsedInput.rpps) : undefined,
          password: await hashPassword(parsedInput.password),
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
      const userFromRPPS = findOne(Number(parsedInput.rpps));

      if (
        userFromRPPS &&
        lastName.toLowerCase() === userFromRPPS?.lastName.toLowerCase() &&
        firstName.toLowerCase() === userFromRPPS.firstName.toLowerCase()
      ) {
        await prisma.user.update({
          where: { email: parsedInput.email },
          data: { approvedAt: new Date() },
        });

        if (process.env.CI !== "true") {
          await sendMailApproved({
            email: parsedInput.email,
            firstName,
            lastName,
          });

          await fetch(env.NTFY_ADMIN_URL ?? "", {
            method: "POST",
            body: `${(
              await prisma.user.count({ where: { approvedAt: null } })
            ).toString()} en attente`,
            headers: {
              Tags: "+1,robot",
              Title: `Nouvelle inscription approuvée automatiquement sur plandeprise.fr`,
            },
          });
        }
      } else {
        if (process.env.CI !== "true") {
          await sendMailRegistered({
            email: parsedInput.email,
            firstName,
            lastName,
          });

          await fetch(env.NTFY_ADMIN_URL ?? "", {
            method: "POST",
            body: `${(
              await prisma.user.count({ where: { approvedAt: null } })
            ).toString()} en attente`,
            headers: {
              Actions: `view, Approuver, ${getUrl(routes.users() as `/${string}`)}`,
              Click: getUrl(routes.users() as `/${string}`),
              Tags: "+1",
              Title: `Nouvelle inscription à valider sur plandeprise.fr`,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error sending registration mail: ", error);

      throw new PP_Error("USER_REGISTER_WARNING");
    }

    return MUTATION_SUCCESS;
  });
