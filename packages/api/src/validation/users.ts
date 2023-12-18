import * as yup from "yup";
import { z } from "zod";

import setLanguage from "./locale";

setLanguage();

export const ALLOWED_UPLOADED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/pdf",
];

export const MAX_UPLOADED_FILE_SIZE = 2000000;

const requiredIfServer = (schema: yup.Schema, server = false) =>
  server ? (schema.required() as yup.Schema) : schema;

const password = yup.string().min(8).max(20).required().label("Mot de passe");

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
  password,
});

export const registerSchemaServer = yup.object({
  firstName: yup.string().required().max(50).label("Prénom"),
  lastName: yup.string().required().max(50).label("Nom"),
  student: yup.boolean(),
  certificate: yup
    .string()
    .when("student", {
      is: true,
      then: (certificate) =>
        certificate.required().label("Certificat de scolarité"),
    })
    .nullable(),
  rpps: yup.string().when("student", {
    is: false,
    then: (rpps) =>
      rpps
        .required()
        .min(11)
        .max(11)
        .matches(/^\d+$/, "RPPS doit être un numéro")
        .label("RPPS"),
  }),
  displayName: yup
    .string()
    .notRequired()
    .transform((value?: string) => (value === "" ? undefined : value))
    .min(3)
    .max(50)
    .label("Nom de la structure"),
  email: yup.string().email().required().label("Email"),
  password,
  password_confirmation: yup
    .string()
    .oneOf(
      [yup.ref("password")],
      "Les deux mots de passe ne correspondent pas. ",
    )
    .required()
    .label("Confirmation du mot de passe"),
  recaptcha: yup.string().required(),
});

export const registerSchemaClient = registerSchemaServer.concat(
  yup.object({
    certificate: yup
      .mixed()
      .notRequired()
      .when("student", {
        is: true,
        then: (certificate) =>
          certificate
            .required()
            .test(
              "fileName",
              "Certificat de scolarité est obligatoire",
              (value: { name?: string }) =>
                value && "name" in (value || {})
                  ? (value.name ?? "").length > 0
                  : false,
            )
            .test(
              "fileSize",
              "Le fichier envoyé est trop volumineux",
              (value: { size?: number }) =>
                value && "size" in (value || {})
                  ? (value?.size ?? Infinity) <= MAX_UPLOADED_FILE_SIZE
                  : false,
            )
            .test(
              "fileType",
              "Le fichier envoyé doit être de type pdf, jpg ou png. ",
              (value: { type?: string }) =>
                value && "type" in (value || {})
                  ? ALLOWED_UPLOADED_FILE_TYPES.includes(value?.type ?? "")
                  : false,
            )
            .label("Certificat de scolarité"),
      }),
    recaptcha: yup.string(),
  }),
);

export const resetPasswordSchema = yup.object({
  token: yup.string().required(),
  email: yup.string().email().required(),
  password,
  password_confirmation: yup
    .string()
    .oneOf(
      [yup.ref("password")],
      "Les deux mots de passe ne correspondent pas. ",
    )
    .required()
    .label("Confirmation du mot de passe"),
});

export const updateUserSchema = (server = false) => {
  return yup
    .object({
      id: requiredIfServer(yup.string(), server),
    })
    .concat(
      registerSchemaServer.pick([
        "email",
        "firstName",
        "lastName",
        "displayName",
        "rpps",
        "student",
      ]),
    );
};

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
