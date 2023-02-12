"use client";

import AdminGuardError from "lib/errors/AdminGuardError";
import { selectUser } from "lib/redux/auth/selectors";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";

const AdminGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!user.admin) {
      throw new AdminGuardError();
    }
  }, [user]);

  return <>{children}</>;
};
export default AdminGuard;
