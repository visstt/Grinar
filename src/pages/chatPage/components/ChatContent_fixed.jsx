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
      const fileUrl = `${import.meta.env.VITE_API_URL}${filePath}`;

      // Определяем тип файла по расширению
      const fileExtension = fileName.split(".").pop()?.toLowerCase();
      const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
        fileExtension,
      );

      if (isImage) {
        return (
          <div className={styles.fileMessage}>
            <img
              src={fileUrl}
              alt={fileName}
              className={styles.messageImage}
              onClick={() => window.open(fileUrl, "_blank")}
            />
            <p className={styles.fileName}>{fileName}</p>
          </div>
        );
      } else {
        return (
          <div className={styles.fileMessage}>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fileLink}
            >
              📎 {fileName}
            </a>
          </div>
        );
      }
    }

    return <p>{content}</p>;
  };

  if (loading) {
    return (
      <div className={styles.chatContent}>
        <ChatSidebar />
        <div className={styles.mainContent}>
          <div className={styles.loadingState}>Загрузка сообщений...</div>
        </div>
      </div>
    );
  }

  if (!currentReceiver) {
    return (
      <div className={styles.chatContent}>
        <ChatSidebar />
        <div className={styles.mainContent}>
          <div className={styles.emptyState}>
            Выберите пользователя для начала чата
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatContent}>
      <ChatSidebar />
      <div className={styles.mainContent}>
        <div className={styles.chatHeader}>
          <ChatHeader selectedChat={selectedChat} />
        </div>
        <div className={styles.messagesContainer}>
          <div className={styles.messages}>
            {messages.length > 0 ? (
              <>
                {messages.map((message) => {
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
                        <small className={styles.messageTime}>
                          {formatTime(message.createdAt)}
                        </small>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className={styles.noMessages}>
                <p>Нет сообщений. Начните переписку!</p>
              </div>
            )}
          </div>
        </div>
        <div className={headerStyles.sticky_input_wrapper}>
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
