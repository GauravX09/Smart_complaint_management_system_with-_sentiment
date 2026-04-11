import axios from "axios";

const API = axios.create({
  baseURL: "https://smartbackend-production-5756.up.railway.app/api",
  withCredentials: false,
});

// 🔐 Attach JWT token (EXCEPT for OPTIONS)
API.interceptors.request.use(
  (config) => {
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