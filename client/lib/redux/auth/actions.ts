import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { Document, DocWithErrors, ErrorObject } from "jsonapi-typescript";
import axios from "lib/axios";
import { LoginCredentials, UserObject } from "lib/types";

const fetchCsrfCookie = () => axios.get("/sanctum/csrf-cookie");

export const fetchUserAction = createAsyncThunk("user/fetchUser", async () =>
  axios.get<Document>("/api/user").then((response) => {
    if ("data" in response.data) {
      return response.data.data as UserObject;
    }

    throw new Error();
  })
);

export const loginUserAction = createAsyncThunk<
  UserObject | undefined,
  LoginCredentials,
  {
    rejectValue: ErrorObject | undefined;
  }
>("user/login", async (credentials, { dispatch, rejectWithValue }) => {
  try {
    await fetchCsrfCookie();

    await axios.post("/login", credentials);

    dispatch(fetchUserAction());

    return;
  } catch (error) {
    const axiosError = error as AxiosError<DocWithErrors>;
    return rejectWithValue(axiosError.response?.data.errors[0]);
  }
});

export const logoutUserAction = createAsyncThunk("user/logout", async () => {
  await axios.post("/logout");
  return;
});
