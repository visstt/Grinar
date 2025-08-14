import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children, contactUserId }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentReceiver, setCurrentReceiver] = useState(contactUserId || null);
  const [isInitialized, setIsInitialized] = useState(false);

  const selectChat = (chat) => {
    // Избегаем ненужных обновлений, если чат уже выбран
    if (selectedChat?.id !== chat.id || currentReceiver !== chat.id) {
      setSelectedChat(chat);
      setCurrentReceiver(chat.id);
    }
  };

  // Если передан contactUserId, автоматически устанавливаем его как получателя только при первой загрузке
  useEffect(() => {
    if (contactUserId && !isInitialized) {
      setCurrentReceiver(contactUserId);
      // Создаем временный объект чата для отображения
      setSelectedChat({
        id: contactUserId,
        fullName: "Загрузка...", // Имя будет обновлено когда загрузятся данные
      });
      setIsInitialized(true);
    }
  }, [contactUserId, isInitialized]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        currentReceiver,
        selectChat,
        setSelectedChat,
        setCurrentReceiver,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
