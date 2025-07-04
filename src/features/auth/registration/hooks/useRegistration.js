import { useState } from "react";

import api from "../../../../shared/api/api";

export function useRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function register({
    profileTypeId,
    login,
    email,
    password,
    repassword,
  }) {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/sign-up", {
        profileTypeId,
        login,
        email,
        password,
        repassword,
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Ошибка регистрации");
      return null;
    }
  }

  return { register, loading, error };
}
