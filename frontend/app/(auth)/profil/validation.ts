import { z } from "zod";

import {
  registerSchemaIsPharmacist,
  registerSchemaIsStudent,
} from "@plan-prise/api/validation/users";

const password = z.string().min(8).max(20);

export const updateUserSchema = z
  .discriminatedUnion("student", [
    registerSchemaIsStudent.omit({ certificate: true }),
    registerSchemaIsPharmacist.omit({ certificate: true }),
  ])
  .and(
    z.object({
      id: typeof window === "undefined" ? z.string() : z.undefined(),
      email: z.string().email(),
      firstName: z.string().min(3).max(50),
      lastName: z.string().min(3).max(50),
      displayName: z
        .string()
        .min(3)
        .max(50)
        .optional()
        .transform((value?: string) => (value === "" ? undefined : value)),
    }),
  );

export const updateUserPasswordSchema = z
  .object({
    current_password: z.string(),
    password: password,
    password_confirmation: password,
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les deux mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  });

export const deleteCurrentUserSchema = z.object({
  password: z.string(),
});
