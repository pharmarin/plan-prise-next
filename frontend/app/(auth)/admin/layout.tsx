import type { PropsWithChildren } from "react";
import AdminGuard from "@/components/guards/AdminGuard";

const AdminLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <AdminGuard>{children}</AdminGuard>;
};
export default AdminLayout;
