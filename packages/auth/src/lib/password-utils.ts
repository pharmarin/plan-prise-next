import "server-only";

import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

export const checkPassword = (
  formPassword: string,
  dbPassword: User["password"],
) => bcrypt.compare(formPassword, dbPassword.replace(/^\$2y/, "$2a"));

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);
