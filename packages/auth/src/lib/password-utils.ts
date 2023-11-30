import bcrypt from "bcrypt";

import type { User } from "@plan-prise/db-drizzle";

export const checkPassword = (
  formPassword: string,
  dbPassword: User["password"],
) => bcrypt.compare(formPassword, dbPassword.replace(/^\$2y/, "$2a"));

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);
