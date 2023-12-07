import type { PropsWithChildren } from "react";
import AdminGuard from "@/app/_components/AdminGuard";

const AdminLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <AdminGuard>{children}</AdminGuard>;
};
export default AdminLayout;
