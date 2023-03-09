"use client";

import { trpc } from "@/common/trpc";
import LoadingScreen from "@/components/overlays/screens/LoadingScreen";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, type PropsWithChildren } from "react";

const AuthGuard: React.FC<PropsWithChildren<{ guest?: boolean }>> = ({
  children,
  guest,
}) => {
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user } = trpc.users.current.useQuery();

  const isUnauthenticatedAuth = !guest && session.status === "unauthenticated";
  const isAuthenticatedGuestWithRedirect =
    guest && session.status === "authenticated";
  const isIncompleteProfile =
    session.status === "authenticated" &&
    user &&
    (!user.firstName || !user.lastName);

  useEffect(() => {
    if (isIncompleteProfile) {
      router.push("/profil");
    }
  }, [isIncompleteProfile, router]);

  useEffect(() => {
    if (isUnauthenticatedAuth) {
      router.push(
        `/login${
          (pathname && pathname !== "/" && `?redirectTo=${pathname}`) || ""
        }`
      );
    }
    if (isAuthenticatedGuestWithRedirect) {
      router.push(searchParams?.get("redirectTo") || "/");
    }
  }, [
    isAuthenticatedGuestWithRedirect,
    isUnauthenticatedAuth,
    pathname,
    router,
    searchParams,
  ]);

  if (
    (!guest && session.status === "authenticated") ||
    (guest && session.status !== "authenticated")
  ) {
    return <>{children}</>;
  }

  return <LoadingScreen />;
};

export default AuthGuard;
