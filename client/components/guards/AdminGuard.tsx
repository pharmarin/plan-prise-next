"use client";

import PP_Error from "@/utils/errors";
import { useSession } from "next-auth/react";
import { useEffect, type PropsWithChildren } from "react";

const AdminGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const { data } = useSession();

  useEffect(() => {
    if (!data?.user?.admin) {
      throw new PP_Error("UNAUTHORIZED_ADMIN");
    }
  }, [data?.user]);

  return <>{children}</>;
};
export default AdminGuard;
