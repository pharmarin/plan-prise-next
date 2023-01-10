import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserAction,
  loginUserAction,
  logoutUserAction,
} from "lib/redux/auth/actions";
import { AuthReduxState } from "lib/types";

const initialState: AuthReduxState = {
  login: {
    isLoading: false,
    error: undefined,
  },
  user: {
    isLoading: false,
    data: undefined,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserAction.pending, (state) => {
      state.user.data = undefined;
      state.user.isLoading = true;
    });

    builder.addCase(fetchUserAction.fulfilled, (state, { payload }) => {
      state.user.isLoading = false;
      state.user.data = payload;
    });

    builder.addCase(fetchUserAction.rejected, (state) => {
      state.user.isLoading = false;
    });

    builder.addCase(loginUserAction.pending, (state) => {
      // Reset state
      state.user.data = undefined;
      state.login.error = undefined;
      // Then
      state.login.isLoading = true;
    });

    builder.addCase(loginUserAction.fulfilled, (state, { payload }) => {
      state.login.isLoading = false;
      state.user.data = payload;
    });

    builder.addCase(loginUserAction.rejected, (state, { payload }) => {
      state.login.isLoading = false;
      state.login.error = payload;
    });

    builder.addCase(logoutUserAction.pending, (state) => {
      state.user.data = undefined;
    });
  },
});

export default authSlice.reducer;
