import { SerializedError } from "@reduxjs/toolkit";
import { UserType } from "lib/types";

export type AuthReduxState = {
  user?: UserType;
  login: {
    isLoading: boolean;
    error?: SerializedError;
  };
};
