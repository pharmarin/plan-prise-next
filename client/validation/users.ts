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

const requiredIfServer = (schema: yup.AnySchema, server = false) =>
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
    rpps: yup.mixed().when("student", {
      is: false,
      then: yup
        .string()
        .required()
        .min(11)
        .max(11)
        .matches(/^\d+$/, "RPPS doit être un numéro")
        .label("RPPS"),
    }),
    certificate: server
      ? yup.mixed().when("student", {
          is: true,
          then: yup.string().required().label("Certificat de scolarité"),
        })
      : yup.mixed().when("student", {
          is: true,
          then: yup
            .mixed()
            .test(
              "fileName",
              "Certificat de scolarité est obligatoire",
              (value: { name: string }) =>
                "name" in (value || {}) ? (value.name || "").length > 0 : false
            )
            .test(
              "fileSize",
              "Le fichier envoyé est trop volumineux",
              (value: { size: number }) =>
                "size" in (value || {})
                  ? value.size <= MAX_UPLOADED_FILE_SIZE
                  : false
            )
            .test(
              "fileType",
              "Le fichier envoyé doit être de type pdf, jpg ou png. ",
              (value: { type: string }) =>
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

export const updateUserSchema = (server = false) => {
  const _registerSchema = registerSchema(server);

  return yup.object({
    id: requiredIfServer(yup.string(), server),
    email: _registerSchema.fields.email,
    firstName: _registerSchema.fields.firstName,
    lastName: _registerSchema.fields.lastName,
    displayName: _registerSchema.fields.displayName,
    rpps: _registerSchema.fields.rpps,
    student: _registerSchema.fields.student,
  });
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
