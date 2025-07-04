import { useState } from "react";

import api from "../../../../shared/api/api";

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function sendForgotPassword(email) {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка восстановления");
      setLoading(false);
      return null;
    }
  }

  return { sendForgotPassword, loading, error };
}
