import type { ReactNode } from "react";
import { unstable_cache } from "next/cache";
import { Navbar } from "@/app/(auth)/navbar";
import type { Session } from "next-auth";

import { getServerSession } from "@plan-prise/auth/get-session";
import prisma from "@plan-prise/db-prisma";
import PP_Error from "@plan-prise/errors";

const fetchUser = unstable_cache(
  async (session: Session) => {
    return await prisma.user.findUniqueOrThrow({
      where: { id: session?.user.id },
      select: { lastName: true, firstName: true },
    });
  },
  ["user-navbar-infos"],
  { tags: ["user-navbar-infos"] },
);

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession();

  if (!session) {
    throw new PP_Error("UNAUTHORIZED_AUTH");
  }

  const user = await fetchUser(session);

  return (
    <>
      <Navbar user={user} />
      <div className="container mx-auto mb-4 flex flex-1 flex-col rounded-lg bg-white p-4 shadow-inner">
        {children}
      </div>
    </>
  );
};

export default AuthLayout;

export const dynamic = "force-dynamic";
