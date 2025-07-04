import { useState } from "react";
import api from "../../../../shared/api/api";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function login(email, password) {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/auth/sign-in`, { email, password });
      setLoading(false);
      return response.data; 
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Ошибка авторизации");
      console.error(err);
      
      return null;
    }
  }

  return { login, loading, error };
}