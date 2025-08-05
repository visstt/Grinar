import axios from "axios";

import { useUserStore } from "../store/userStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Хранилище для отслеживания запросов, которые уже были повторены
const retriedRequests = new Set();

// Перехватчик для проверки истечения токена на каждый ответ
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestKey = `${originalRequest.method}-${originalRequest.url}`;

    // Если сервер вернул 401 (Unauthorized) и запрос еще не повторялся
    if (
      error.response &&
      error.response.status === 401 &&
      !retriedRequests.has(requestKey)
    ) {
      // Помечаем запрос как повторенный, чтобы избежать бесконечного цикла
      retriedRequests.add(requestKey);

      try {
        // Повторяем оригинальный запрос
        const response = await api(originalRequest);
        // Если успешно, удаляем из списка повторенных запросов
        retriedRequests.delete(requestKey);
        return response;
      } catch (retryError) {
        // Если повторный запрос тоже неудачен, очищаем данные пользователя
        useUserStore.getState().logout();
        window.localStorage.removeItem("user-storage");
        return Promise.reject(retryError);
      }
    } else if (error.response && error.response.status === 401) {
      // Если получили 401 повторно, очищаем данные пользователя
      useUserStore.getState().logout();
      window.localStorage.removeItem("user-storage");
    }

    // Для всех остальных ошибок
    return Promise.reject(error);
  },
);

export default api;
