import axios from "axios";

// Auto-detect backend on Render if not explicitly provided
const getBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== "undefined" && window.location.hostname.includes("onrender.com")) {
    return "https://bootcamp-r0i8.onrender.com/api/v1";
  }
  return "http://localhost:8000/api/v1";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("devbloom_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("devbloom_token");
    }
    return Promise.reject(error);
  }
);

export default api;
