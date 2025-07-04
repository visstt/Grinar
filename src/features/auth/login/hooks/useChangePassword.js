import { useState } from "react";

import api from "../../../../shared/api/api";

export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function changePassword(userId, password) {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/change-password", { userId, password });
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка смены пароля");
      setLoading(false);
      return false;
    }
  }

  return { changePassword, loading, error };
}
