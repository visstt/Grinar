import { useCallback, useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../../../shared/api/api";

export default function useMyProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Получаем ID текущего пользователя
  const fetchCurrentUserId = useCallback(() => {
    return api.get("/user/get-my-profile").then((res) => {
      const currentId = res.data.id?.toString();
      setCurrentUserId(currentId);
      return currentId;
    });
  }, []);

  const fetchProfile = useCallback(() => {
    setLoading(true);

    // Определяем, какой endpoint использовать
    const isOwnProfile = currentUserId && userId === currentUserId;
    const endpoint = isOwnProfile
      ? "/user/get-my-profile"
      : `/user/get-profile/${userId}`;

    api
      .get(endpoint)
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err?.response?.data || err.message || err))
      .finally(() => setLoading(false));
  }, [userId, currentUserId]);

  useEffect(() => {
    // Сначала получаем ID текущего пользователя
    fetchCurrentUserId();
  }, [fetchCurrentUserId]);

  useEffect(() => {
    // Вызываем fetchProfile только когда currentUserId установлен
    if (currentUserId !== null) {
      fetchProfile();
    }
  }, [fetchProfile, currentUserId, userId]);

  const isOwnProfile = currentUserId && userId === currentUserId;

  const removeProject = useCallback(
    (projectId) => {
      // Разрешаем удаление только для собственного профиля
      if (isOwnProfile) {
        setProfile((prev) => ({
          ...prev,
          projects: prev.projects.filter((project) => project.id !== projectId),
        }));
      }
    },
    [isOwnProfile],
  );

  const removeBlog = useCallback(
    (blogId) => {
      // Разрешаем удаление только для собственного профиля
      if (isOwnProfile) {
        setProfile((prev) => ({
          ...prev,
          blogs: prev.blogs.filter((blog) => blog.id !== blogId),
        }));
      }
    },
    [isOwnProfile],
  );

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    removeProject,
    removeBlog,
    isOwnProfile,
    userId,
  };
}
