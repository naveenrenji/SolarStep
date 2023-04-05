import axios from "axios";
import { USER_LOCAL_STORAGE_KEY } from "../constants";
import { getFromStorage } from "../utils";

const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

http.interceptors.request.use(
  (config) => {
    const user = getFromStorage(USER_LOCAL_STORAGE_KEY);
    config.headers["accesstoken"] = user?.accessToken || "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
