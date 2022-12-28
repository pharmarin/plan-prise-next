import axios from "lib/axios";
import { LoginCredentialsType, UserType } from "lib/types";

export const fetchUser = () =>
  axios
    .get<UserType | undefined>("/api/user")
    .then((response) => response.data)
    // Catch error whithout action: error 401 if user not loggedIn
    .catch();

export const fetchCsrfCookie = () => axios.get("/sanctum/csrf-cookie");

export const loginUser = async (credentials: LoginCredentialsType) => {
  await fetchCsrfCookie();

  return axios
    .post<UserType | undefined>("/login", credentials)
    .then((response) => response.data);
};

export const logoutUser = async () => {
  axios.post("/logout");
};
