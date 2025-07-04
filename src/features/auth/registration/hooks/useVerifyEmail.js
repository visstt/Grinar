import { useState } from "react";

import api from "../../../../shared/api/api";

export function useVerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function verifyEmail(email, code) {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/auth/verify-email", {
        params: {
          email,
          code,
        },
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка подтверждения");
      setLoading(false);
      return null;
    }
  }

  return { verifyEmail, loading, error };
}
