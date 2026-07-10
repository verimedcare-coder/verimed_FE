import axios from "axios";
import { getToken, removeToken } from "../utils/storage";

const apiClient = axios.create({
  baseURL:
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
    process.env.REACT_APP_API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized (401). Clearing token.");
      removeToken();
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
