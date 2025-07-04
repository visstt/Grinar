import { useState } from "react";

import api from "../../../../shared/api/api";

export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function changePassword(userId, password) {
    setLoading(true);
    setError(null);
    try {
      console.log("Запрос на /auth/change-password", { userId, password });
      await api.post("/auth/change-password", { userId, password });
      setLoading(false);
      console.log("Пароль успешно изменён");
      return true;
    } catch (err) {
      console.log("Ошибка при смене пароля:", err);
      setError(err.response?.data?.message || "Ошибка смены пароля");
      setLoading(false);
      return false;
    }
  }

  return { changePassword, loading, error };
}
