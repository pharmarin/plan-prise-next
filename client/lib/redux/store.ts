import { combineReducers, configureStore } from "@reduxjs/toolkit";
import auth from "lib/redux/auth/slice";
import navigation from "lib/redux/navigation/slice";
import resources from "lib/redux/resources/slice";
import { useDispatch as useReduxDispatch } from "react-redux";
import logger from "redux-logger";

const rootReducer = combineReducers({
  auth,
  navigation,
  resources,
});

const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  reducer: rootReducer,
});

export type ReduxState = ReturnType<typeof rootReducer>;
export type ReduxDispatch = typeof store.dispatch;

export const useDispatch: () => ReduxDispatch = useReduxDispatch;

export default store;
