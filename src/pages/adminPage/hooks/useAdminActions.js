import { useCallback, useState } from "react";

import api from "../../../shared/api/api";

export default function useAdminActions() {
  const [loading, setLoading] = useState(false);

  const executeAction = useCallback(async (actionName, apiCall) => {
    setLoading(true);
    try {
      await apiCall();
    } catch (error) {
      console.error(`Ошибка при выполнении ${actionName}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(
    async (userId) => {
      return executeAction("Удаление пользователя", async () => {
        const response = await api.delete(`/admin/delete-user/${userId}`);
        console.log(`Пользователь ${userId} удален`, response.data);
      });
    },
    [executeAction],
  );

  const blockUser = useCallback(
    async (userId, reason) => {
      return executeAction("Блокировка пользователя", async () => {
        const response = await api.post(`/admin/ban-user/${userId}`, {
          reason: reason || "Причина не указана",
        });
        console.log(`Пользователь ${userId} заблокирован`, response.data);
      });
    },
    [executeAction],
  );

  const unblockUser = useCallback(
    async (userId) => {
      return executeAction("Разблокировка пользователя", async () => {
        const response = await api.post(`/admin/unban-user/${userId}`);
        console.log(`Пользователь ${userId} разблокирован`, response.data);
      });
    },
    [executeAction],
  );

  const updateSubscription = useCallback(
    async (userId, subscription) => {
      return executeAction("Обновление подписки", async () => {
        // Мапим названия подписок в ID
        const subscriptionMap = {
          default: "1",
          pro: "2",
          premium: "3",
        };

        const subscriptionId = subscriptionMap[subscription] || "1";

        const response = await api.put(
          `/admin/update-subscription/${userId}?subscriptionId=${subscriptionId}`,
        );
        console.log(
          `Подписка пользователя ${userId} обновлена на ${subscription}`,
          response.data,
        );
      });
    },
    [executeAction],
  );

  return {
    deleteUser,
    blockUser,
    unblockUser,
    updateSubscription,
    actionLoading: loading,
  };
}
