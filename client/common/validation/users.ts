import setLanguage from "common/validation/locale";
import * as yup from "yup";

setLanguage();

export const requireIdSchema = yup.string().required();
