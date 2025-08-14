import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const ChatContext = createContext();

export function ChatProvider({ children, contactUserId }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentReceiver, setCurrentReceiver] = useState(contactUserId || null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [refreshChatsCallback, setRefreshChatsCallback] = useState(null);

  const selectChat = useCallback(
    (chat) => {
      // Обновляем если ID отличается, currentReceiver отличается, или если данные пользователя изменились
      if (
        selectedChat?.id !== chat.id ||
        currentReceiver !== chat.id ||
        selectedChat?.fullName !== chat.fullName ||
        selectedChat?.logoFileName !== chat.logoFileName
      ) {
        setSelectedChat(chat);
        setCurrentReceiver(chat.id);
      }
    },
    [selectedChat, currentReceiver],
  );

  const setRefreshChats = useCallback((callback) => {
    setRefreshChatsCallback(() => callback);
  }, []);

  const refreshChats = useCallback(() => {
    if (refreshChatsCallback) {
      refreshChatsCallback();
    }
  }, [refreshChatsCallback]);

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
        setRefreshChats,
        refreshChats,
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
