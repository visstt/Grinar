import axios from "axios";

import { useUserStore } from "../store/userStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Перехватчик для проверки истечения токена на каждый ответ
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если сервер вернул 401 (Unauthorized) и запрос еще не повторялся
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Повторяем оригинальный запрос
        return api(originalRequest);
      } catch (retryError) {
        // Если повторный запрос тоже неудачен, очищаем данные пользователя
        useUserStore.getState().logout();
        window.localStorage.removeItem("user-storage");
        return Promise.reject(retryError);
      }
    }

    // Для всех остальных ошибок
    return Promise.reject(error);
  },
);

export default api;
