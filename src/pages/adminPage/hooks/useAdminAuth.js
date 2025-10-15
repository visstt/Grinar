import { useCallback, useEffect, useState } from "react";

export default function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminLoginTime");
    setIsAuthenticated(false);
  }, []);

  const checkAuth = useCallback(() => {
    try {
      const isAuth = localStorage.getItem("adminAuthenticated");
      const loginTime = localStorage.getItem("adminLoginTime");

      if (isAuth === "true" && loginTime) {
        // Проверяем, не истекла ли сессия (24 часа)
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах
        const now = Date.now();
        const timeDiff = now - parseInt(loginTime);

        if (timeDiff < sessionDuration) {
          setIsAuthenticated(true);
        } else {
          // Сессия истекла
          logout();
        }
      }
    } catch (error) {
      console.error("Ошибка при проверке авторизации:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // Функция для проверки валидности сессии
  const login = useCallback((success) => {
    if (success) {
      setIsAuthenticated(true);
    }
  }, []);

  const refreshSession = useCallback(() => {
    const isAuth = localStorage.getItem("adminAuthenticated");
    const loginTime = localStorage.getItem("adminLoginTime");

    if (isAuth === "true" && loginTime) {
      // Обновляем время последней активности
      localStorage.setItem("adminLoginTime", Date.now().toString());
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshSession,
    checkAuth,
  };
}
