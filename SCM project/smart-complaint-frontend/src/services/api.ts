import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/",
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