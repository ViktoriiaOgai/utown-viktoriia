import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // правильно типизированный originalRequest
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const requestUrl = originalRequest?.url || "";

    // guard для /auth/login и /auth/refresh
    if (requestUrl.includes("/auth/login") || requestUrl.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // если ошибка не 401 или нет запроса
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // защита от бесконечного цикла
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        { refreshToken }
      );

      const newToken = res.data.token;

      localStorage.setItem("accessToken", newToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      return api(originalRequest);
    } catch {
      // очистка и редирект на логин
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }
    }
  }
);