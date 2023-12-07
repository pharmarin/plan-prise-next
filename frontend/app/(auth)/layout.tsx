import type { PropsWithChildren } from "react";
import AuthGuard from "@/app/_components/AuthGuard";
import Navbar from "@/app/_components/Navbar";
import { AuthProviders } from "@/app/_components/Providers";

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthGuard>
      <AuthProviders>
        <Navbar />
        <div className="container mx-auto mb-4 flex flex-1 flex-col rounded-lg bg-white p-4 shadow-inner">
          {children}
        </div>
      </AuthProviders>
    </AuthGuard>
  );
};

export default AuthLayout;
