// api.js
import axios from "axios";

const ipAddress = import.meta.env.VITE_IP_ADDRESS;
const contextRoot = import.meta.env.VITE_CONTEXT_ROOT;

const api = axios.create({
  baseURL: `${ipAddress}${contextRoot}`,
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("loginToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ❗️Only set Content-Type if not FormData
    if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);
// // Response interceptor to handle 401 errors and refresh tokens
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const refreshToken = localStorage.getItem("refreshToken");
//       if (!refreshToken) {
//         localStorage.clear();
//         window.location.href = "/login";
//         return Promise.reject(error);
//       }

//       try {
//         const res = await axios.post(
//           `${ipAddress}${contextRoot}/auth/refresh`,
//           { refreshToken }
//         );
//         localStorage.setItem("loginToken", res.data.loginToken);
//         originalRequest.headers.Authorization = `Bearer ${res.data.loginToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         localStorage.clear();
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
