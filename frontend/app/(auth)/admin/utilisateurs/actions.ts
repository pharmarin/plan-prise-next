"use server";

import { adminAction } from "@/app/_safe-actions/safe-actions";
import { z } from "zod";

import { sendMailApproved } from "@plan-prise/api";
import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import prisma, { exclude } from "@plan-prise/db-prisma";

export const approveUserAction = adminAction(
  z.object({
    userId: z.string().cuid2(),
  }),
  async ({ userId }) => {
    const user = exclude(
      await prisma.user.update({
        where: { id: userId },
        data: { approvedAt: new Date(), certificate: null },
      }),
      ["password"],
    );

    try {
      await sendMailApproved(user);
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de l'envoi du mail d'activation. ",
        error,
      );
    }

    return MUTATION_SUCCESS;
  },
);
