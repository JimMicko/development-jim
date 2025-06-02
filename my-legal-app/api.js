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

export default api;
