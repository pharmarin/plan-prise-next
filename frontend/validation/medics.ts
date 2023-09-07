import prisma from "@/prisma";
import * as z from "zod";

export const medicId = z.string().cuid();

export const findAllValidation = z.object({
  fields: z.array(
    z
      .string()
      .refine((field) => Object.keys(prisma.medicament.fields).includes(field)),
  ),
  value: z.string(),
});
