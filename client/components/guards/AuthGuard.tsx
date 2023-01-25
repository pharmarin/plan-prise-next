"use client";

import Welcome from "app/Welcome";
import LoadingScreen from "components/overlays/screens/LoadingScreen";
import { fetchUserAction } from "lib/redux/auth/actions";
import {
  selectIsCheckingUser,
  selectIsLoggedIn,
  selectUser,
} from "lib/redux/auth/selectors";
import { ReduxState, useDispatch } from "lib/redux/store";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";

const AuthGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();

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
    if (isLoggedIn && (!user.firstName || !user.lastName)) {
      router.push("/profil");
    }
  }, [isLoggedIn, user]);

  if (isCheckingUser) {
    return <LoadingScreen />;
  }

  return <>{isLoggedIn ? children : <Welcome />}</>;
};

export default AuthGuard;
