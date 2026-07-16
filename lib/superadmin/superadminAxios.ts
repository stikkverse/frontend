import axios from "axios";

const superadminAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const PUBLIC_PATHS = ["/api/v1/auth/login"];

superadminAxios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sa_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

superadminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const requestPath = error.config?.url ?? "";
      const isPublic = PUBLIC_PATHS.some((path) => requestPath.includes(path));

      if (!isPublic) {
        localStorage.removeItem("sa_access_token");
        window.location.href = "/superadmin/login";
      }
    }
    return Promise.reject(error);
  },
);

export default superadminAxios;