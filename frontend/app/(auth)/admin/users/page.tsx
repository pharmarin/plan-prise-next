import UsersClient from "@/app/(auth)/admin/users/client";
import { Navigation } from "@/app/state-navigation";

import type { User } from "@plan-prise/db-prisma";
import prisma from "@plan-prise/db-prisma";

const PAGE_TITLE = "Utilisateurs";

export type CleanUser = Pick<
  User,
  | "id"
  | "firstName"
  | "lastName"
  | "displayName"
  | "admin"
  | "student"
  | "createdAt"
  | "approvedAt"
>;

const UsersServer = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      displayName: true,
      admin: true,
      student: true,
      createdAt: true,
      approvedAt: true,
    },
  });

  return (
    <>
      <Navigation title={PAGE_TITLE} returnTo="/admin" />
      <UsersClient users={users} />
    </>
  );
};

export default UsersServer;

export const metadata = {
  title: PAGE_TITLE,
};
