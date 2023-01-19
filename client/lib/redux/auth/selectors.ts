import { createSelector } from "@reduxjs/toolkit";
import User from "lib/redux/models/User";
import { ReduxState } from "lib/redux/store";

export const selectAuth = (state: ReduxState) => state.auth;

export const selectUserData = (state: ReduxState) =>
  selectAuth(state).user.data;

export const selectUser = (state: ReduxState) =>
  new User(selectAuth(state).user.data);

export const selectIsCheckingUser = (state: ReduxState) =>
  selectAuth(state).user.isLoading;

export const selectIsLoggedIn = (state: ReduxState) => !!selectUserData(state);

export const selectLoginError = createSelector(
  selectAuth,
  (auth) => auth.login.error
);
