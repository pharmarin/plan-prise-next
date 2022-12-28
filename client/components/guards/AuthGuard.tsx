"use client";

import Welcome from "components/containers/Welcome";
import Navbar from "components/navigation/Navbar";
import { fetchUserAction } from "lib/redux/auth/actions";
import { selectIsLoggedIn } from "lib/redux/auth/selectors";
import { ReduxState, useDispatch } from "lib/redux/store";
import React, { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";

const AuthGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state: ReduxState) =>
    selectIsLoggedIn(state)
  );

  useEffect(() => {
    // Fetch user on mount to get user if already logged in
    dispatch(fetchUserAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navbar />
          {children}
        </>
      ) : (
        <Welcome />
      )}
    </>
  );
};

export default AuthGuard;
