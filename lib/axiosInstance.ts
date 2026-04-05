import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const PUBLIC_PATHS = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/verify-email",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/reset-password",
  "/api/v1/auth/accept-invite",
  "/api/v1/auth/invitations/validate",
];

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const apiKey = localStorage.getItem("api_key");
    if (apiKey) {
      config.headers["x-api-key"] = apiKey;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const requestPath = error.config?.url ?? "";
      const isPublic = PUBLIC_PATHS.some((path) => requestPath.includes(path));

      if (!isPublic) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("api_key");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;