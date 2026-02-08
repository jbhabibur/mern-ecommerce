/**
 * API SERVICE INSTANCE
 * Centralized Axios configuration for all backend communication.
 */
import axios from "axios";
import { BASE_URL } from "./apiConfig";

const apiInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * AUTH INTERCEPTOR
 * Automatically attaches JWT token to every outgoing request.
 */
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiInstance;
