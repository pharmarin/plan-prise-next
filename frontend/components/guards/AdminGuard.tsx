import type { PropsWithChildren } from "react";
import { getServerSession } from "@/next-auth/get-session";
import PP_Error from "@/utils/errors";

const AdminGuard = async ({ children }: PropsWithChildren) => {
  const session = await getServerSession();

  if (!session?.user?.admin) {
    throw new PP_Error("UNAUTHORIZED_ADMIN");
  }

  return <>{children}</>;
};
export default AdminGuard;
