import Axios, { AxiosError } from "axios";
import { fetchCsrfCookie } from "lib/redux/auth/actions";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

/**
 * Create axios instance with default params to handle CSRF Cookie and baseUrl
 */
const axios = Axios.create({
  baseURL: (APP_URL || "") + API_PATH,
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

/**
 * If server respond with code 419 (CSRF token mismatch), fetch a new cookie and send request again
 */
axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 419) {
      await fetchCsrfCookie();

      return axios(error.response.config);
    }

    return Promise.reject(error);
  }
);

export default axios;
