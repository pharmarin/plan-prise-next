import { ActionCreator, AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { setReturnTo, setTitle } from "lib/redux/navigation/slice";
import { ReduxState, useDispatch } from "lib/redux/store";
import { NavigationState } from "lib/types";
import { useEffect } from "react";

export const setNavigation: ActionCreator<
  ThunkAction<void, ReduxState, void, AnyAction>
> =
  (title: NavigationState["title"], returnTo: NavigationState["returnTo"]) =>
  (dispatch) => {
    dispatch(setTitle(title));
    dispatch(setReturnTo(returnTo));
  };

export const useSetTitle = (title: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle(title));
  }, [dispatch, title]);
};
