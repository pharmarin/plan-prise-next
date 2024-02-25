"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { authAction } from "@/app/_safe-actions/safe-actions";
import {
  deleteCurrentUserSchema,
  updateUserPasswordSchema,
  updateUserSchema,
} from "@/app/(auth)/profil/validation";

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

export const updateCurrentUserAction = authAction(
  updateUserSchema,
  async ({ id, ...input }) => {
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
  },
);

export const updateCurrentUserPasswordAction = authAction(
  updateUserPasswordSchema,
  async (input, { userId }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { password: true },
    });

    if (await checkPassword(input.current_password, user.password)) {
      await prisma.user.update({
        where: { id: userId },
        data: { password: await hashPassword(input.password) },
      });

      return MUTATION_SUCCESS;
    }

    throw new PP_Error("PASSWORD_MISMATCH");
  },
);

export const deleteCurrentUserAction = authAction(
  deleteCurrentUserSchema,
  async (input, { userId }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { password: true },
    });

    if (await checkPassword(input.password, user.password)) {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return MUTATION_SUCCESS;
    }

    throw new PP_Error("PASSWORD_MISMATCH");
  },
);
