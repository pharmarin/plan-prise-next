import { createSelector } from "@reduxjs/toolkit";
import { ReduxState } from "lib/redux/store";

const selectNavigation = (state: ReduxState) => state.navigation;

export const selectOptions = createSelector(
  selectNavigation,
  (navigation) => navigation.options
);

export const selectReturnTo = createSelector(
  selectNavigation,
  (navigation) => navigation.returnTo
);

export const selectTitle = createSelector(
  selectNavigation,
  (navigation) => navigation.title
);
