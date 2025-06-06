// api.js
import axios from "axios";

const ipAddress = import.meta.env.VITE_IP_ADDRESS;
const contextRoot = import.meta.env.VITE_CONTEXT_ROOT;

const api = axios.create({
  baseURL: `${ipAddress}${contextRoot}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request: attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("loginToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${ipAddress}${contextRoot}/auth/refresh`,
            {
              refreshToken,
            }
          );

          const newToken = res.data.loginToken;
          localStorage.setItem("loginToken", newToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
