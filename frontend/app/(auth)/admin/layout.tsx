import type { PropsWithChildren } from "react";
import AdminGuard from "@/app/(auth)/admin/guard";

const AdminLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <AdminGuard>{children}</AdminGuard>;
};
export default AdminLayout;
