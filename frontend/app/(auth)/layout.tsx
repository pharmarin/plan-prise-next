import type { PropsWithChildren } from "react";
import { AuthProviders } from "@/app/_components/Providers";
import AuthGuard from "@/components/guards/AuthGuard";
import Navbar from "@/components/navigation/Navbar";

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
