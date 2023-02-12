import AdminGuard from "components/guards/AdminGuard";
import { PropsWithChildren } from "react";

const AdminLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <AdminGuard>{children}</AdminGuard>;
};
export default AdminLayout;
