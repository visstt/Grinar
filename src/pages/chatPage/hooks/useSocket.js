import { useEffect, useRef, useState } from "react";

import { io } from "socket.io-client";

import { useUserStore } from "../../../shared/store/userStore";

export default function useSocket() {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) return;

    // Создаем подключение к WebSocket
    socketRef.current = io(`${import.meta.env.VITE_API_WS_URL}/chat`, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  const sendMessage = (receiverId, content, filePath = null) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("sendMessage", {
        receiverId,
        content,
        filePath,
      });
    }
  };

  const subscribeToMessages = (callback) => {
    if (socketRef.current) {
      socketRef.current.on("receiveMessage", callback);
    }
  };

  const unsubscribeFromMessages = () => {
    if (socketRef.current) {
      socketRef.current.off("receiveMessage");
    }
  };

  return {
    isConnected,
    sendMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
  };
}
