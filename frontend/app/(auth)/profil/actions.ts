"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  deleteCurrentUserSchema,
  updateUserPasswordSchema,
  updateUserSchema,
} from "@/app/(auth)/profil/validation";
import { authAction } from "@/app/safe-actions";

import {
  formatDisplayName,
  formatFirstName,
  formatLastName,
} from "@plan-prise/api";
import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import {
  checkPassword,
  hashPassword,
} from "@plan-prise/auth/lib/password-utils";
import prisma, { exclude } from "@plan-prise/db-prisma";
import PP_Error from "@plan-prise/errors";

export const updateCurrentUserAction = authAction
  .schema(updateUserSchema)
  .action(async ({ parsedInput: { id, ...input } }) => {
    const user = exclude(
      await prisma.user.update({
        where: { id },
        data: {
          ...input,
          firstName: formatFirstName(input.firstName),
          lastName: formatLastName(input.lastName),
          displayName: formatDisplayName(input.displayName),
          rpps: input.rpps ? BigInt(input.rpps) : undefined,
        },
      }),
      ["password"],
    );

    revalidatePath("/profil");
    revalidateTag("user-navbar-infos");

    return user;
  });

export const updateCurrentUserPasswordAction = authAction
  .schema(updateUserPasswordSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { password: true },
    });

    if (await checkPassword(parsedInput.current_password, user.password)) {
      await prisma.user.update({
        where: { id: userId },
        data: { password: await hashPassword(parsedInput.password) },
      });

      return MUTATION_SUCCESS;
    }

    throw new PP_Error("PASSWORD_MISMATCH");
  });

export const deleteCurrentUserAction = authAction
  .schema(deleteCurrentUserSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { password: true },
    });

    if (await checkPassword(parsedInput.password, user.password)) {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return MUTATION_SUCCESS;
    }

    throw new PP_Error("PASSWORD_MISMATCH");
  });
