import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export function useUserById(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Очищаем предыдущие данные при смене пользователя
    setUser(null);
    setError(null);

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/user/user-profile/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке пользователя:", err);

        // Если пользователь не найден (404), это не критическая ошибка
        if (err.response?.status === 404) {
          setError(null); // Не устанавливаем ошибку для 404
        } else {
          setError(
            err.response?.data?.message || "Ошибка при загрузке пользователя",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}
