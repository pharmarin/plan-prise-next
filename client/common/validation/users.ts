import { getRegisterSchema } from "common/validation/auth";
import setLanguage from "common/validation/locale";
import * as yup from "yup";

setLanguage();

export const requireIdSchema = yup.string().required();

export const getUpdateUserSchema = (server = false) => {
  const registerSchema = getRegisterSchema(server);

  return yup.object({
    id: server ? requireIdSchema : yup.string().notRequired(),
    email: registerSchema.fields.email,
    firstName: registerSchema.fields.firstName,
    lastName: registerSchema.fields.lastName,
    displayName: registerSchema.fields.displayName,
    rpps: registerSchema.fields.rpps,
    student: registerSchema.fields.student,
  });
};
