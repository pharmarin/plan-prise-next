import type { PropsWithChildren } from "react";
import { serverApi } from "@/app/_trpc/serverApi";
import AuthGuard from "@/app/(auth)/guard";
import { Navbar } from "@/app/(auth)/navbar";

const AuthLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  const user = await serverApi.users.current.query();

  return (
    <AuthGuard>
      <Navbar serverUser={user} />
      <div className="container mx-auto mb-4 flex flex-1 flex-col rounded-lg bg-white p-4 shadow-inner">
        {children}
      </div>
    </AuthGuard>
  );
};

export default AuthLayout;
