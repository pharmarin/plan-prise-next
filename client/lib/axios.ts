import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

export default instance;
