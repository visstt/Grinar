import { useCallback, useEffect, useState } from "react";

import api from "../../../shared/api/api";

export default function useChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/chat/chats");
      setChats(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке чатов:", err);
      setError(err.response?.data?.message || "Ошибка при загрузке чатов");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshChats = useCallback(async () => {
    try {
      const response = await api.get("/chat/chats");
      setChats(response.data);
    } catch (err) {
      console.error("Ошибка при обновлении чатов:", err);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return { chats, loading, error, refreshChats };
}
