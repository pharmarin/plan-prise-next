"use client";

import { trpc } from "@/trpc/client";
import PP_Error from "@/utils/errors";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

const IncompleteProfileGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: user } = trpc.users.current.useQuery();

  if (!user) {
    throw new PP_Error("UNAUTHORIZED_AUTH");
  }

  if (!user.firstName || !user.lastName) {
    return redirect("/profil" as __next_route_internal_types__.StaticRoutes);
  }

  return <>{children}</>;
};

export default IncompleteProfileGuard;
