"use client";

import AuthGuard from "components/guards/AuthGuard";
import Navbar from "components/navigation/Navbar";
import { PropsWithChildren } from "react";

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthGuard>
      <>
        <Navbar />
        <div className="container mx-auto mb-8 overflow-hidden rounded-lg bg-white p-4 shadow-md">
          {children}
        </div>
      </>
    </AuthGuard>
  );
};

export default AuthLayout;
