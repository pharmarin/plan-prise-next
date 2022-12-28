import { createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { fetchUser, loginUser, logoutUser } from "lib/auth";
import { LoginCredentialsType } from "lib/types";

export const fetchUserAction = createAsyncThunk(
  "user/fetchUser",
  async () => await fetchUser()
);

export const loginUserAction = createAsyncThunk<
  void,
  LoginCredentialsType,
  {
    rejectValue: SerializedError;
  }
>("user/login", async (credentials, { dispatch, rejectWithValue }) => {
  try {
    await loginUser(credentials);
    dispatch(fetchUserAction());
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue({
      code: String(axiosError.response?.status),
      message:
        axiosError.response?.data.message ||
        "Une erreur est survenir lors de la connexion. ",
    });
  }
});

export const logoutUserAction = createAsyncThunk(
  "user/logout",
  async () => await logoutUser()
);
