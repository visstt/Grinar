import { useEffect, useRef } from "react";

import { useUserStore } from "../../../shared/store/userStore";
import styles from "../ChatPage.module.css";
import { useChat } from "../context/ChatContext";
import useConversation from "../hooks/useConversation";
import useSocket from "../hooks/useSocket";
import { useUserById } from "../hooks/useUserById";
import MessageInput from "./MessageInput";
import ChatHeader from "./chatContent/chatHeader/ChatHeader";
import headerStyles from "./chatContent/chatHeader/ChatHeader.module.css";
import ChatSidebar from "./chatSidebar/ChatSidebar";

export default function ChatContent() {
  const { selectedChat, currentReceiver, selectChat } = useChat();
  const { user } = useUserStore();
  const { messages, setMessages, loading } = useConversation(currentReceiver);
  const messagesEndRef = useRef(null);
  const userIdToFetch = currentReceiver;

  const { user: contactUser } = useUserById(userIdToFetch);
  const { sendMessage, subscribeToMessages, unsubscribeFromMessages } =
    useSocket();

  // Обновляем информацию о чате когда загружается пользователь
  useEffect(() => {
    if (
      contactUser &&
      currentReceiver &&
      contactUser.id === currentReceiver &&
      selectedChat?.fullName !== contactUser.fullName
    ) {
      selectChat({
        id: contactUser.id,
        fullName: contactUser.fullName,
        logoFileName: contactUser.logoFileName,
        specialization: contactUser.specialization,
        city: contactUser.city,
      });
    }
  }, [contactUser, currentReceiver, selectedChat?.fullName, selectChat]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (
        message.senderId === currentReceiver ||
        message.receiverId === currentReceiver
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    subscribeToMessages(handleNewMessage);

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    currentReceiver,
    subscribeToMessages,
    unsubscribeFromMessages,
    setMessages,
  ]);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (content) => {
    if (currentReceiver && content.trim()) {
      sendMessage(currentReceiver, content.trim());
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessageContent = (content) => {
    // Проверяем, является ли сообщение файлом в формате [Файл: название](путь)
    const fileRegex = /^\[Файл: (.+)\]\((.+)\)$/;
    const match = content.match(fileRegex);

    if (match) {
      const [, fileName, filePath] = match;
      const fileExtension = fileName.split(".").pop().toLowerCase();

      // Если это изображение, показываем превью
      if (["jpg", "jpeg", "png"].includes(fileExtension)) {
        return (
          <div>
            <img
              src={`${window.location.origin}${filePath}`}
              alt={fileName}
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() =>
                window.open(`${window.location.origin}${filePath}`, "_blank")
              }
            />
            <p style={{ fontSize: "12px", marginTop: "4px", opacity: 0.7 }}>
              {fileName}
            </p>
          </div>
        );
      } else {
        // Для других файлов показываем ссылку для скачивания
        return (
          <div>
            <a
              href={`${window.location.origin}${filePath}`}
              download={fileName}
              style={{
                color: "#195ee6",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              📄 {fileName}
            </a>
          </div>
        );
      }
    }

    // Обычное текстовое сообщение
    return <p>{content}</p>;
  };

  return (
    <>
      <ChatSidebar />
      <div className={styles.chatContent}>
        {selectedChat ? (
          <>
            <ChatHeader selectedChat={selectedChat} />
            <div className={styles.messages}>
              {loading ? (
                <div className={styles.loading}>
                  Загрузка сообщений... (receiverId: {currentReceiver})
                </div>
              ) : messages.length === 0 ? (
                <div className={styles.noMessages}>
                  <p>Нет сообщений. Начните беседу!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const userId = user?.id;
                  const isMyMessage =
                    Number(message.senderId) === Number(userId);

                  return (
                    <div key={message.id} className={styles.messageWrapper}>
                      <div
                        className={
                          isMyMessage ? styles.myMessage : styles.otherMessage
                        }
                      >
                        {renderMessageContent(message.content)}
                      </div>
                      <span className={styles.messageTime}>
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            <MessageInput onSendMessage={handleSendMessage} disabled={false} />
          </>
        ) : (
          <>
            <div className={headerStyles.chatHeader}>
              <div className={styles.emptyHeader}>
                <h2>Выберите чат</h2>
                <p>Выберите пользователя из списка слева для начала общения</p>
              </div>
            </div>
            <div className={styles.messages}>
              <div className={styles.noChatSelected}>
                <p>Здесь будут отображаться сообщения</p>
              </div>
            </div>
            <MessageInput onSendMessage={() => {}} disabled={true} />
          </>
        )}
      </div>
    </>
  );
}
