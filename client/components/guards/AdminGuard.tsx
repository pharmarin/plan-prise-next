"use client";

import AdminGuardError from "@/common/errors/AdminGuardError";
import { useSession } from "next-auth/react";
import { type PropsWithChildren, useEffect } from "react";

const AdminGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const { data } = useSession();

  useEffect(() => {
    if (!data?.user?.admin) {
      throw new AdminGuardError();
    }
  }, [data?.user]);

  return <>{children}</>;
};
export default AdminGuard;
