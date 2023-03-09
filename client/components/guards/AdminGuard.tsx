"use client";

import { useSession } from "next-auth/react";
import { useEffect, type PropsWithChildren } from "react";

const AdminGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const { data } = useSession();

  useEffect(() => {
    if (!data?.user?.admin) {
      // FIXME: throw new AdminGuardError();
    }
  }, [data?.user]);

  return <>{children}</>;
};
export default AdminGuard;
