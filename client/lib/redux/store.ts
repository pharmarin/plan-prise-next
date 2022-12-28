import { configureStore } from "@reduxjs/toolkit";
import authReducer from "lib/redux/auth/slice";
import { useDispatch as useReduxDispatch } from "react-redux";
import logger from "redux-logger";

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  reducer: {
    auth: authReducer,
  },
});

export type ReduxState = ReturnType<typeof store.getState>;
export type ReduxDispatch = typeof store.dispatch;

export const useDispatch: () => ReduxDispatch = useReduxDispatch;
