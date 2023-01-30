import Axios from "axios";

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

export default axios;
