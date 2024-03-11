"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/app/routes-schema";
import { useSession } from "next-auth/react";

import LoadingScreen from "@plan-prise/ui/components/pages/Loading";

const AuthGuard = ({
  children,
  guest,
  searchParams,
}: {
  children: React.ReactNode;
  guest?: boolean;
  searchParams?: {
    redirect?: string;
  };
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { status: sessionStatus } = useSession();
  const authorized = sessionStatus === "authenticated";
  const unAuthorized = sessionStatus === "unauthenticated";
  const loading = sessionStatus === "loading";

  useEffect(() => {
    if (loading) return;

    if (!guest && unAuthorized) {
      router.push(
        routes.login(
          pathname === "/"
            ? undefined
            : {
                search: { redirect: pathname },
              },
        ),
      );
    }

    if (guest && authorized) {
      return router.push(searchParams?.redirect ?? "/");
    }
  }, [
    loading,
    unAuthorized,
    sessionStatus,
    router,
    guest,
    authorized,
    searchParams?.redirect,
    pathname,
  ]);

  if (loading || (!guest && unAuthorized) || (guest && authorized)) {
    return <LoadingScreen fullscreen />;
  }

  // INFO: Redirect to profil page if incomplete is handled in Navbar.tsx

  return <>{children}</>;
};

export default AuthGuard;
