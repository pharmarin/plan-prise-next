import { z } from "zod";

import "./locale";

export const ALLOWED_UPLOADED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/pdf",
];

export const MAX_UPLOADED_FILE_SIZE = 2000000;

const password = z.string().min(8).max(20);

export const approveUserSchema = z.object({
  id: z.string().cuid2(),
});

export const deleteUserSchema = z.object({
  id: z.string().cuid2(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
  recaptcha: z.string(),
});

export const getUniqueUserSchema = z.string();

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const confirmPasswordSchema = z.object({
  password,
});

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

const registerSchemaIsStudent = z.object({
  student: z.literal(true),
  certificate: z.object({
    fileName: z.string(),
    data: z.string(),
  }),
  rpps: z.string().optional(),
});

const registerSchemaIsPharmacist = z.object({
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
    password,
    password_confirmation: password,
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

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    email: z.string().email(),
    password: password,
    password_confirmation: password,
    recaptcha: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les deux mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  });

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
    current_password: password,
    password: password,
    password_confirmation: password,
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les deux mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  });
