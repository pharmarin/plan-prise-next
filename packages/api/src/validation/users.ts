import * as yup from "yup";
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

export const approveUserSchema = yup.string().required();

export const deleteUserSchema = yup.string().required();

export const forgotPasswordSchema = yup.object({
  email: yup.string().email().required().label("Adresse mail"),
  recaptcha: yup.string(),
});

export const getUniqueUserSchema = yup.string().required();

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const passwordVerifySchema = yup.object({
  id: yup.string().required(),
  password: yup.string().min(8).max(20).required().label("Mot de passe"),
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
    password_confirmation: z.string(),
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

export const resetPasswordSchema = yup.object({
  token: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).max(20).required().label("Mot de passe"),
  password_confirmation: yup
    .string()
    .oneOf(
      [yup.ref("password")],
      "Les deux mots de passe ne correspondent pas. ",
    )
    .required()
    .label("Confirmation du mot de passe"),
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

export const updateUserPasswordSchema = yup.object({
  current_password: yup.string().required().label("Mot de passe actuel"),
  password: yup
    .string()
    .min(8)
    .max(20)
    .required()
    .label("Nouveau mot de passe"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")])
    .required()
    .label("Confirmation du nouveau mot de passe"),
});
