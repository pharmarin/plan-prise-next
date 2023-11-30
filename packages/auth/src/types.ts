import type { User } from "@plan-prise/db-drizzle";

export type UserSafe = Omit<User, "password">;
export type UserSession = Pick<
  User,
  "admin" | "id" | "displayName" | "lastName" | "firstName"
>;
