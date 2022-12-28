import { createSelector } from "@reduxjs/toolkit";
import { ReduxState } from "lib/redux/store";

export const selectAuth = (state: ReduxState) => state.auth;

export const selectUser = (state: ReduxState) => selectAuth(state).user;

export const selectIsLoggedIn = (state: ReduxState) => !!selectUser(state);

export const selectLoginError = createSelector(
  selectAuth,
  (auth) => auth.login.error
);
