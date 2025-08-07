import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export const useUserProfile = (userId) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/user/user-profile/${userId}`);
        setUserProfile(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Ошибка при загрузке профиля пользователя",
        );
        console.error("Ошибка при загрузке профиля пользователя:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const refetch = () => {
    if (userId) {
      const fetchUserProfile = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await api.get(`/user/user-profile/${userId}`);
          setUserProfile(response.data);
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "Ошибка при загрузке профиля пользователя",
          );
          console.error("Ошибка при загрузке профиля пользователя:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    }
  };

  return { userProfile, loading, error, refetch };
};
