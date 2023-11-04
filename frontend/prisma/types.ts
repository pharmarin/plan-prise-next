import type {User} from "@prisma/client";

export type UserSafe = Omit<User, "password">;
export type UserSession = Pick<
  User,
  "admin" | "id" | "displayName" | "lastName" | "firstName"
>;
