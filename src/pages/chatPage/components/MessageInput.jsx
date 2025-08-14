import { useState } from "react";

import styles from "../ChatPage.module.css";
import { useFileUpload } from "../hooks/useFileUpload";

export default function MessageInput({ onSendMessage, disabled = false }) {
  const [message, setMessage] = useState("");

  const { uploading, fileInputRef, openFileDialog, handleFileChange } =
    useFileUpload(onSendMessage);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleFileClick = () => {
    if (!disabled) {
      openFileDialog();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.inputField}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <img
        src="/icons/chat/folder.svg"
        alt="folder"
        className={styles.icon}
        style={{
          opacity: disabled || uploading ? 0.3 : 0.7,
          cursor: disabled || uploading ? "not-allowed" : "pointer",
        }}
        onClick={handleFileClick}
      />
      <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex" }}>
        <input
          type="text"
          placeholder={
            uploading
              ? "Загрузка файла..."
              : disabled
                ? "Выберите чат для отправки сообщения..."
                : "Введите сообщение..."
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled || uploading}
          className={disabled ? styles.disabledInput : ""}
        />
      </form>
      <img
        src="/icons/chat/emoji.svg"
        alt="emoji"
        className={styles.icon}
        style={{ opacity: disabled ? 0.3 : 0.7 }}
      />
      <img
        src="/icons/chat/send.svg"
        alt="send"
        className={styles.icon}
        style={{
          opacity: disabled ? 0.3 : 0.7,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onClick={handleSubmit}
      />
      <img
        src="/icons/chat/microphone.svg"
        alt="microphone"
        className={styles.icon}
        style={{ opacity: disabled ? 0.3 : 0.7 }}
      />
    </div>
  );
}
