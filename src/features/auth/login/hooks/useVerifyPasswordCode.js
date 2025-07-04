import { useState } from "react";

import api from "../../../../shared/api/api";

export function useVerifyPasswordCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function verifyPasswordCode(email, code) {
    setLoading(true);
    setError(null);
    try {
      console.log("Запрос на /auth/verify-password-code", { email, code });
      const response = await api.get("/auth/verify-password-code", {
        params: { email, code },
      });
      console.log("Ответ сервера:", response.data);
      setLoading(false);
      // Если сервер возвращает просто число:
      return typeof response.data === "number"
        ? response.data
        : response.data?.userId || null;
    } catch (err) {
      console.log("Ошибка при подтверждении кода:", err);
      setError(err.response?.data?.message || "Ошибка подтверждения кода");
      setLoading(false);
      return null;
    }
  }

  return { verifyPasswordCode, loading, error };
}
