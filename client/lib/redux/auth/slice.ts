import { createSlice, SerializedError } from "@reduxjs/toolkit";
import {
  fetchUserAction,
  loginUserAction,
  logoutUserAction,
} from "lib/redux/auth/actions";
import { AuthReduxState } from "lib/redux/auth/types";

const initialState: AuthReduxState = {
  login: {
    isLoading: false,
    error: undefined,
  },
  user: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserAction.pending, (state) => {
      // Reset state
      state.user = undefined;
      state.login.error = undefined;
      // Then
      state.login.isLoading = true;
    });

    builder.addCase(fetchUserAction.fulfilled, (state, { payload }) => {
      state.login.isLoading = false;
      state.user = payload;
    });

    builder.addCase(fetchUserAction.rejected, (state, { payload }) => {
      state.login.isLoading = false;
      state.login.error = payload as SerializedError;
    });

    builder.addCase(loginUserAction.pending, (state) => {
      // Reset state
      state.user = undefined;
      state.login.error = undefined;
      // Then
      state.login.isLoading = true;
    });

    builder.addCase(loginUserAction.fulfilled, (state, { payload }) => {
      state.login.isLoading = false;
    });

    builder.addCase(loginUserAction.rejected, (state, { payload }) => {
      state.login.isLoading = false;
      state.login.error = payload as SerializedError;
    });

    builder.addCase(logoutUserAction.pending, (state) => {
      state.user = undefined;
    });
  },
});

const authReducer = authSlice.reducer;

export default authReducer;
