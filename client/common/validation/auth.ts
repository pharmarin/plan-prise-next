import * as yup from "yup";

export const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/pdf",
];

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
    then: yup.string().required().min(11).max(11).label("RPPS"),
  }),
  certificate: yup.mixed().when("student", {
    is: true,
    then: yup
      .mixed()
      .required()
      .test("fileSize", (value) =>
        "size" in (value || {}) ? value.size <= 2000000 : false
      )
      .test("fileType", (value) =>
        "type" in (value || {})
          ? ALLOWED_FILE_TYPES.includes(value.type)
          : false
      )
      .label("Certificat de scolarité"),
  }),
  displayName: yup
    .string()
    .notRequired()
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

export type ILogin = typeof loginSchema;
export type ISignUp = typeof registerSchema;
