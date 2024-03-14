import type { ReactNode } from "react";
import { unstable_cache } from "next/cache";
import { Navbar } from "@/app/(auth)/navbar";

import { getServerSession } from "@plan-prise/auth/get-session";
import prisma from "@plan-prise/db-prisma";

const fetchUser = unstable_cache(
  async () => {
    const session = await getServerSession();

    return await prisma.user.findUniqueOrThrow({
      where: { id: session?.user.id },
      select: { lastName: true, firstName: true },
    });
  },
  ["user-navbar-infos"],
  { tags: ["user-navbar-infos"] },
);

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const user = await fetchUser();

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
