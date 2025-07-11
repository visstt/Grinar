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
  (error) => {
    // Если сервер вернул 401 (Unauthorized), очищаем userStore и localStorage
    if (error.response && error.response.status === 401) {
      useUserStore.getState().logout();
      window.localStorage.removeItem("user-storage");
    }
    return Promise.reject(error);
  },
);

export default api;
