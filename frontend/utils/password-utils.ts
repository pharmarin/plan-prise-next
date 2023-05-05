import type { User } from "@prisma/client";
import bcrypt from "bcrypt";

export const checkPassword = (
  formPassword: string,
  dbPassword: User["password"]
) => bcrypt.compareSync(formPassword, dbPassword.replace(/^\$2y/, "$2a"));

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);
