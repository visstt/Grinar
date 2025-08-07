import { useState } from "react";

import api from "../../../shared/api/api";

export const useUserSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subscribeToUser = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/user/subscribe-user?userId=${userId}`);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Ошибка при подписке на пользователя";
      setError(errorMessage);
      console.error("Ошибка при подписке на пользователя:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromUser = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(
        `/user/unsubscribe-user?userId=${userId}`,
      );
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Ошибка при отписке от пользователя";
      setError(errorMessage);
      console.error("Ошибка при отписке от пользователя:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    subscribeToUser,
    unsubscribeFromUser,
    loading,
    error,
  };
};
