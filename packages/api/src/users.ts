import { startCase, toUpper } from "lodash-es";

import type { User } from "@plan-prise/db-prisma";

import sendMail from "../utils/mail";
import getUrl from "../utils/url";

export const exclude = <User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> => {
  for (const key of keys) {
    delete user[key];
  }
  return user;
};

export const pick = <User, Key extends keyof User>(object: User, keys: Key[]) =>
  keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {} as User);

export const sendMailApproved = (
  user: Pick<User, "email" | "firstName" | "lastName">,
) =>
  sendMail(
    { email: user.email, name: `${user.firstName} ${user.lastName}` },
    "Votre compte a été validé !",
    "351ndgwr91d4zqx8",
  );

export const sendMailRegistered = (
  user: Pick<User, "email" | "firstName" | "lastName">,
) =>
  sendMail(
    { email: user.email, name: `${user.firstName} ${user.lastName}` },
    "Bienvenue sur plandeprise.fr !",
    "pq3enl6xr8rl2vwr",
  );

export const sendMailReinitPassword = (
  user: Pick<User, "email" | "firstName" | "lastName">,
  token: string,
) =>
  sendMail(
    {
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    },
    "Réinitialisez votre mot de passe... ",
    "jy7zpl95vjo45vx6",
    {
      link: getUrl(`/password-reset?email=${user.email}&token=${token}`),
    },
  );

export const formatFirstName = (firstName: string) =>
  startCase(firstName.toLowerCase());
export const formatLastName = (lastName: string) => toUpper(lastName);
export const formatDisplayName = (displayName?: string | null) =>
  displayName ? startCase(displayName.toLowerCase()) : null;
