import type { PropsWithChildren } from "react";
import AuthGuard from "@/app/(auth)/guard";
import { Navbar } from "@/app/(auth)/navbar";

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthGuard>
      <Navbar />
      <div className="container mx-auto mb-4 flex flex-1 flex-col rounded-lg bg-white p-4 shadow-inner">
        {children}
      </div>
    </AuthGuard>
  );
};

export default AuthLayout;
