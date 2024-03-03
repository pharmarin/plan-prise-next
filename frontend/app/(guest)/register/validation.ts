import { passwordSchema } from "@/app/validation";
import { z } from "zod";

import {
  ALLOWED_UPLOADED_FILE_TYPES,
  MAX_UPLOADED_FILE_SIZE,
} from "./constants";

export const registerSchemaCertificate = z
  .instanceof(File)
  .refine(
    (file) => file.size < MAX_UPLOADED_FILE_SIZE,
    "Le fichier ne doit pas dépasser 2 Mo",
  )
  .refine(
    (file) => ALLOWED_UPLOADED_FILE_TYPES.includes(file.type),
    "Le fichier doit être au format .png, .jpg, .jpeg ou .pdf",
  );

export const registerSchemaIsStudent = z.object({
  student: z.literal(true),
  certificate: z.object({
    fileName: z.string(),
    data: z.string(),
  }),
  rpps: z.string().optional(),
});

export const registerSchemaIsPharmacist = z.object({
  student: z.literal(false),
  certificate: z.object({}).optional(),
  rpps: z
    .string()
    .regex(/\d{11}/, "RPPS doit contenir 11 chiffres")
    .refine((n) => Number(n) >= 0),
});

export const registerSchemaStep1 = z
  .discriminatedUnion("student", [
    registerSchemaIsStudent,
    registerSchemaIsPharmacist,
  ])
  .and(
    z.object({
      firstName: z.string().min(3).max(50),
      lastName: z.string().min(3).max(50),
    }),
  );

export const registerSchemaStep2 = z
  .object({
    email: z.string().email(),
    displayName: z
      .string()
      .min(3)
      .max(50)
      .optional()
      .transform((value?: string) => (value === "" ? undefined : value)),
    password: passwordSchema,
    password_confirmation: passwordSchema,
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les deux mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  });

export const registerSchema = registerSchemaStep1.and(registerSchemaStep2).and(
  z.object({
    recaptcha:
      typeof window !== "undefined"
        ? // client-only
          z.string().optional()
        : // server-only
          z.string(),
  }),
);
