"use client";

import LoadingScreen from "components/overlays/screens/LoadingScreen";
import { fetchUserAction } from "lib/redux/auth/actions";
import {
  selectIsCheckingUser,
  selectIsLoggedIn,
  selectUser,
} from "lib/redux/auth/selectors";
import { ReduxState, useDispatch } from "lib/redux/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";

const AuthGuard: React.FC<
  PropsWithChildren<{ guest?: boolean; noRedirect?: boolean }>
> = ({ children, guest, noRedirect }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isLoggedIn = useSelector((state: ReduxState) =>
    selectIsLoggedIn(state)
  );
  const isCheckingUser = useSelector(selectIsCheckingUser);
  const user = useSelector(selectUser);

  useEffect(() => {
    // Fetch user on mount to get user if already logged in
    dispatch(fetchUserAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoggedIn && user && (!user.firstName || !user.lastName)) {
      router.push("/profil");
    }
  }, [isLoggedIn, router, user]);

  useEffect(() => {
    if (!isCheckingUser) {
      if (!guest && !isLoggedIn) {
        router.push(`/login?${pathname && `redirectTo=${pathname}`}`);
      }
      if (guest && isLoggedIn && !noRedirect) {
        router.push(searchParams.get("redirectTo") || "/");
      }
    }
  }, [
    guest,
    isCheckingUser,
    isLoggedIn,
    noRedirect,
    pathname,
    router,
    searchParams,
  ]);

  if (!user || isCheckingUser) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default AuthGuard;
