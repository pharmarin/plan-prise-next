import { AuthProviders } from "@/app/Providers";
import AuthGuard from "@/components/guards/AuthGuard";
import Navbar from "@/components/navigation/Navbar";
import { type PropsWithChildren } from "react";

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthGuard>
      <AuthProviders>
        <Navbar />
        <div className="container mx-auto mb-8 overflow-hidden rounded-lg bg-white p-4 shadow-inner">
          {children}
        </div>
      </AuthProviders>
    </AuthGuard>
  );
};

export default AuthLayout;
