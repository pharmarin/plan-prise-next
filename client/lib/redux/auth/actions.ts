import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { Document, DocWithErrors, Errors } from "jsonapi-typescript";
import axios from "lib/axios";
import { LoginCredentials, UserObject } from "lib/types";

/**
 * Request CSRF cookie from server
 *
 * @returns void
 */
export const fetchCsrfCookie = () => axios.get("/sanctum/csrf-cookie");

/** (Redux thunk) Fetch user from server */
export const fetchUserAction = createAsyncThunk(
  "user/fetchUser",
  /**
   * Fetch user from server
   *
   * @returns UserObject
   * @throws Errors
   */
  async () =>
    axios
      .get<Document>("/api/user")
      .then((response) => {
        if ("data" in response.data) {
          return response.data.data as UserObject;
        }

        Promise.reject(undefined);
      })
      .catch((errors: AxiosError<DocWithErrors>) =>
        Promise.reject(errors.response?.data.errors)
      )
);

/** (Redux thunk) Logs user in */
export const loginUserAction = createAsyncThunk<
  UserObject | undefined,
  LoginCredentials,
  {
    rejectValue: Errors | undefined;
  }
>(
  "user/login",
  /**
   *
   * @param credentials Login credentials
   * @param thunkApi
   * @returns Dispatch fetchUserAction
   * @throws Errors
   */
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      await fetchCsrfCookie();

      await axios.post("/login", credentials);

      dispatch(fetchUserAction());

      return;
    } catch (error) {
      const axiosError = error as AxiosError<DocWithErrors>;

      return rejectWithValue(axiosError.response?.data.errors);
    }
  }
);

/** (Redux thunk) Logs user out */
export const logoutUserAction = createAsyncThunk(
  "user/logout",
  /**
   * Logs user out from server
   *
   * @returns void
   */
  async () => {
    await axios.post("/logout");
  }
);
