import { createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { fetchUser, loginUser, logoutUser } from "lib/auth";
import { LoginCredentialsType, UserType } from "lib/types";

export const fetchUserAction = createAsyncThunk(
  "user/fetchUser",
  async () => await fetchUser()
);

export const loginUserAction = createAsyncThunk<
  UserType | undefined,
  LoginCredentialsType,
  {
    rejectValue: SerializedError;
  }
>("user/login", async (credentials, { rejectWithValue }) => {
  try {
    await loginUser(credentials);
    return await fetchUser();
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue({
      code: String(axiosError.response?.status),
      message:
        axiosError.response?.data.message ||
        "Une erreur inconnue est survenue lors de la connexion. ",
    });
  }
});

export const logoutUserAction = createAsyncThunk(
  "user/logout",
  async () => await logoutUser()
);
