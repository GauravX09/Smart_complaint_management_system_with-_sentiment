import axios from "axios";

const API = axios.create({
  baseURL: "https://smartbackend-production-1a43.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Attach JWT
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("superAdminToken") ||
      localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;