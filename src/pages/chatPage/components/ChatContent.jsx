import { useEffect, useRef, useState } from "react";

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

export default function ChatContent({ initialShowSidebar = true }) {
  const { selectedChat, currentReceiver, selectChat, refreshChats } = useChat();
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 700);
  const [showSidebar, setShowSidebar] = useState(initialShowSidebar);
  const { user } = useUserStore();
  const { messages, setMessages, loading } = useConversation(currentReceiver);
  const messagesEndRef = useRef(null);
  const { user: contactUser } = useUserById(currentReceiver);
  const { sendMessage, subscribeToMessages, unsubscribeFromMessages } =
    useSocket();

  // Scroll to the latest message when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle window resize to toggle sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      const narrow = window.innerWidth < 700;
      setIsNarrow(narrow);
      if (!narrow) {
        setShowSidebar(true);
      } else if (selectedChat) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedChat]);

  // Hide sidebar on narrow screens when a chat is selected
  useEffect(() => {
    if (isNarrow && selectedChat) setShowSidebar(false);
  }, [selectedChat, isNarrow]);

  // Update chat info when contact user data changes
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
  }, [contactUser, currentReceiver, selectedChat, selectChat]);

  // Subscribe to new messages
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (
        message.senderId === currentReceiver ||
        message.receiverId === currentReceiver
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
        setTimeout(() => refreshChats?.(), 100);
      }
    };
    subscribeToMessages(handleNewMessage);
    return () => unsubscribeFromMessages();
  }, [
    currentReceiver,
    subscribeToMessages,
    unsubscribeFromMessages,
    setMessages,
    refreshChats,
  ]);

  // Handle chat selection
  const handleChatSelect = (chat) => {
    selectChat(chat);
    if (isNarrow) setShowSidebar(false);
  };

  // Handle back to sidebar
  const handleBackToSidebar = () => setShowSidebar(true);

  // Handle sending a message
  const handleSendMessage = (content) => {
    if (currentReceiver && content.trim()) {
      sendMessage(currentReceiver, content.trim());
      setTimeout(() => refreshChats?.(), 500);
    }
  };

  // Format message timestamp
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render message content (text or file)
  const renderMessageContent = (content) => {
    const fileRegex = /^\[Файл: (.+)\]\((.+)\)$/;
    const match = content.match(fileRegex);
    if (match) {
      const [, fileName, filePath] = match;
      const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}${filePath}`;

      if (["jpg", "jpeg", "png"].includes(fileExtension)) {
        return (
          <div>
            <img
              src={fullUrl}
              alt={`Изображение: ${fileName}`}
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => window.open(fullUrl, "_blank")}
              onError={(e) => (e.currentTarget.src = "/fallback-image.png")} // Fallback for broken images
            />
            <p style={{ fontSize: "12px", marginTop: "4px", opacity: 0.7 }}>
              {fileName}
            </p>
          </div>
        );
      }
      return (
        <div>
          <a
            href={fullUrl}
            download={fileName}
            style={{
              color: "#195ee6",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            aria-label={`Скачать файл ${fileName}`}
          >
            📎 {fileName}
          </a>
        </div>
      );
    }
    return <p>{content}</p>;
  };

  return (
    <div className={styles.chatContainer}>
      {showSidebar && <ChatSidebar onChatSelect={handleChatSelect} />}
      {(!isNarrow || !showSidebar) && (
        <div
          className={`${styles.chatContent} ${!showSidebar ? styles.fullWidth : ""}`}
        >
          {selectedChat ? (
            <>
              <ChatHeader
                selectedChat={selectedChat}
                onBackClick={handleBackToSidebar}
                showBackButton={isNarrow && !showSidebar}
              />
              <div className={styles.messages}>
                {loading ? (
                  <div className={styles.loading}>Загрузка сообщений...</div>
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
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={false}
              />
            </>
          ) : (
            <>
              <div className={headerStyles.chatHeader}>
                <div className={styles.emptyHeader}>
                  <h2>Выберите чат</h2>
                  <p>
                    Выберите пользователя из списка слева для начала общения
                  </p>
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
      )}
    </div>
  );
}
