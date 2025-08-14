import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export default function useConversation(receiverId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!receiverId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const fetchConversation = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(
          `/chat/conversation?otherUserId=${receiverId}`,
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке истории сообщений:", err);
        setError(
          err.response?.data?.message || "Ошибка при загрузке сообщений",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [receiverId]);

  return { messages, setMessages, loading, error };
}
