import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { Document, ErrorObject } from "jsonapi-typescript";
import axios from "lib/axios";
import User, { UserObject } from "lib/redux/models/User";
import { ReduxState } from "lib/redux/store";
import { LoginCredentials } from "lib/types";

export const fetchUser = (
  rejectWithValue: BaseThunkAPI<
    ReduxState,
    undefined,
    Dispatch<AnyAction>,
    ErrorObject
  >["rejectWithValue"]
) =>
  axios.get<Document>("/api/user").then((response) => {
    if ("data" in response.data) {
      return response.data.data as UserObject;
    }

    if ("errors" in response.data) {
      return rejectWithValue(response.data.errors[0]);
    }

    return rejectWithValue({} as ErrorObject);
  });

export const fetchCsrfCookie = () => axios.get("/sanctum/csrf-cookie");

export const loginUser = async (credentials: LoginCredentials) => {
  await fetchCsrfCookie();

  return axios
    .post<User | undefined>("/login", credentials)
    .then((response) => response.data);
};

export const logoutUser = async () => {
  axios.post("/logout");
};
