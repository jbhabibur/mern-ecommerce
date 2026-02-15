import axios from "axios";
import { BASE_URL } from "../config/apiConfig";

const apiInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 * Attaches token for every outgoing request.
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

/**
 * RESPONSE INTERCEPTOR
 * Triggers on 401 Unauthorized to reset the UI and clear session.
 */
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if user is currently on the login page
    const isLoginPage = window.location.pathname.includes("/account/login");

    if (error.response && error.response.status === 401) {
      // Industry Standard: Only redirect if NOT on the login page.
      // Because a 401 on the login page usually indicates incorrect credentials.
      if (!isLoginPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Force redirect to login for session expiry
        window.location.href = "/account/login";
      }
    }

    // Pass the error to the catch block so it can be handled or displayed in the UI
    return Promise.reject(error);
  },
);

export default apiInstance;
