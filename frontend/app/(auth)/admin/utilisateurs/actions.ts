"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/app/routes-schema";
import { adminAction } from "@/app/safe-actions";
import { z } from "zod";

import { sendMailApproved } from "@plan-prise/api";
import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import prisma, { exclude } from "@plan-prise/db-prisma";

export const approveUserAction = adminAction
  .schema(
    z.object({
      userId: z.string().cuid2(),
    }),
  )
  .action(async ({ parsedInput: { userId } }) => {
    const user = exclude(
      await prisma.user.update({
        where: { id: userId },
        data: { approvedAt: new Date(), certificate: null },
      }),
      ["password"],
    );
    revalidatePath(routes.users());

    try {
      await sendMailApproved(user);
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de l'envoi du mail d'activation. ",
        error,
      );
    }

    return MUTATION_SUCCESS;
  });

export const deleteUserAction = adminAction
  .schema(z.object({ userId: z.string().cuid2() }))
  .action(async ({ parsedInput: { userId } }) => {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath(routes.users());
    return MUTATION_SUCCESS;
  });
