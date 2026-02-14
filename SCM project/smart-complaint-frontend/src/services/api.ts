import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: false,
});

// 🔐 Attach JWT token (EXCEPT for OPTIONS)
API.interceptors.request.use(
  (config) => {
    // 🚫 DO NOT attach token for preflight
    if (config.method?.toUpperCase() === "OPTIONS") {
      return config;
    }

    const superAdminToken = localStorage.getItem("superAdminToken");
    const userToken = localStorage.getItem("token");

    const token = superAdminToken || userToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
