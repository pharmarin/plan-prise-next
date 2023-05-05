import AdminGuard from "@/components/guards/AdminGuard";
import { type PropsWithChildren } from "react";

const AdminLayout: React.FC<PropsWithChildren> = ({ children }) => {
  // @ts-expect-error Server Component
  return <AdminGuard>{children}</AdminGuard>;
};
export default AdminLayout;
