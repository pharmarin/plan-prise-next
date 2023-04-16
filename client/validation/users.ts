import setLanguage from "@/validation/locale";
import * as yup from "yup";

setLanguage();

export const ALLOWED_UPLOADED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/pdf",
];

export const MAX_UPLOADED_FILE_SIZE = 2000000;

const requiredIfServer = (schema: yup.Schema, server = false) =>
  server ? schema.required() : schema;

const password = yup.string().min(8).max(20).required().label("Mot de passe");

export const approveUserSchema = yup.string().required();

export const deleteUserSchema = yup.string().required();

export const forgotPasswordSchema = yup.object({
  email: yup.string().email().required().label("Adresse mail"),
  recaptcha: yup.string(),
});

export const getUniqueUserSchema = yup.string().required();

export const loginSchema = yup.object({
  email: yup.string().email().required().label("Adresse mail"),
  password: yup.string().required(),
});

export const passwordVerifySchema = yup.object({
  id: yup.string().required(),
  password,
});

export const registerSchema = (server = false) =>
  yup.object({
    firstName: yup.string().required().max(50).label("Prénom"),
    lastName: yup.string().required().max(50).label("Nom"),
    student: yup.boolean(),
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
    certificate: server
      ? yup.string().when("student", {
          is: true,
          then: (certificate) =>
            certificate.required().label("Certificat de scolarité"),
        })
      : yup
          .object({
            name: yup.string().required(),
            size: yup.number().required(),
            type: yup.string().oneOf(ALLOWED_UPLOADED_FILE_TYPES).required(),
          })
          .when("student", {
            is: true,
            then: (certificate) =>
              certificate
                .test(
                  "fileName",
                  "Certificat de scolarité est obligatoire",
                  (value) =>
                    "name" in (value || {})
                      ? (value.name || "").length > 0
                      : false
                )
                .test(
                  "fileSize",
                  "Le fichier envoyé est trop volumineux",
                  (value) =>
                    "size" in (value || {})
                      ? value.size <= MAX_UPLOADED_FILE_SIZE
                      : false
                )
                .test(
                  "fileType",
                  "Le fichier envoyé doit être de type pdf, jpg ou png. ",
                  (value) =>
                    "type" in (value || {})
                      ? ALLOWED_UPLOADED_FILE_TYPES.includes(value.type)
                      : false
                )
                .label("Certificat de scolarité"),
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
        "Les deux mots de passe ne correspondent pas. "
      )
      .required()
      .label("Confirmation du mot de passe"),
    recaptcha: requiredIfServer(yup.string(), server),
  });

export const resetPasswordSchema = yup.object({
  token: yup.string().required(),
  email: yup.string().email().required(),
  password,
  password_confirmation: yup
    .string()
    .oneOf(
      [yup.ref("password")],
      "Les deux mots de passe ne correspondent pas. "
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
      registerSchema(server).pick([
        "email",
        "firstName",
        "lastName",
        "displayName",
        "rpps",
        "student",
      ])
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
