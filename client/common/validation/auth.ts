import setLanguage from "common/validation/locale";
import * as yup from "yup";

export const ALLOWED_UPLOADED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/pdf",
];

export const MAX_UPLOADED_FILE_SIZE = 2000000;

setLanguage();

export const loginSchema = yup.object({
  email: yup.string().email().required().label("Adresse mail"),
  password: yup.string().required(),
});

export const registerSchema = yup.object({
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
  certificate: yup.mixed().when("student", {
    is: true,
    then: yup
      .mixed()
      .test("fileName", "Certificat de scolarité est obligatoire", (value) =>
        "name" in (value || {}) ? (value.name || "").length > 0 : false
      )
      .test("fileSize", "Le fichier envoyé est trop volumineux", (value) =>
        "size" in (value || {}) ? value.size <= MAX_UPLOADED_FILE_SIZE : false
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
    .transform((value) => (value === "" ? undefined : value))
    .min(3)
    .max(50)
    .label("Nom de la structure"),
  email: yup.string().email().required().label("Email"),
  password: yup.string().min(8).max(20).required().label("Mot de passe"),
  password_confirmation: yup
    .string()
    .oneOf(
      [yup.ref("password")],
      "Les deux mots de passe ne correspondent pas. "
    )
    .required()
    .label("Confirmation du mot de passe"),
  recaptcha: yup.string(),
});

export const registerServerSchema = registerSchema.shape({
  ...registerSchema.fields,
  certificate: yup.mixed().when("student", {
    is: true,
    then: yup.string().required().label("Certificat de scolarité"),
  }),
});

export const passwordVerifySchema = yup.object({
  id: yup.string().required(),
  password: registerSchema.fields.password,
});

export type ILogin = typeof loginSchema;
export type ISignUp = typeof registerSchema;
