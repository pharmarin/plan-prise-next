import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NavigationState } from "lib/types";

const initialState: NavigationState = {
  title: "",
  returnTo: undefined,
  options: undefined,
};

const navigationSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOptions: (
      state,
      { payload }: PayloadAction<NavigationState["options"]>
    ) => {
      state.options = payload;
    },
    setReturnTo: (
      state,
      { payload }: PayloadAction<NavigationState["returnTo"]>
    ) => {
      state.returnTo = payload;
    },
    setTitle: (state, { payload }: PayloadAction<NavigationState["title"]>) => {
      state = Object.assign(state, initialState);
      state.title = payload;
    },
  },
});

export const { setOptions, setReturnTo, setTitle } = navigationSlice.actions;
export default navigationSlice.reducer;
