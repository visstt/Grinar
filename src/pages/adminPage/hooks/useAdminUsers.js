import { useCallback, useEffect, useState } from "react";

import api from "../../../shared/api/api";

export default function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/admin/all-users");

      // Преобразуем данные с бэка в нужный формат
      const formattedUsers = response.data.map((user) => ({
        id: user.id,
        fullName: user.fullName || "Не указано",
        email: user.email,
        logoFileName: user.logoFileName,
        isBlocked: user.activity === "ЗАБЛОКИРОВАН",
        subscription: user.subsription, // используем как есть с бэка (исправим опечатку на бэке позже)
        subscriptionId: user.subscriptionId,
        projectCount: user.projectCount || 0,
        blogsCount: user.blogsCount || 0,
        followers: user.followers || 0,
        city: user.city || "Не указан",
        specialization: user.specialization || "Не указана",
        registerDate: user.registerDate,
        activity: user.activity,
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error("Ошибка при загрузке пользователей:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserInList = useCallback((userId, updates) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ...updates } : user,
      ),
    );
  }, []);

  const removeUserFromList = useCallback((userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  }, []);

  // Автоматически загружаем пользователей при монтировании компонента
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserInList,
    removeUserFromList,
  };
}
