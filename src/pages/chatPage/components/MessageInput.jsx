import { useEffect, useRef, useState } from "react";

import styles from "../ChatPage.module.css";
import { useFileUpload } from "../hooks/useFileUpload";

export default function MessageInput({ onSendMessage, disabled = false }) {
  const [message, setMessage] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const stickerMenuRef = useRef(null);

  // Набор стикеров
  const stickers = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "😈",
    "👿",
    "👹",
    "👺",
    "🤡",
    "💩",
    "👻",
    "💀",
    "☠️",
    "👽",
    "👾",
    "🤖",
    "🎃",
    "😺",
    "😸",
    "😹",
    "😻",
    "😼",
    "😽",
    "🙀",
    "😿",
    "😾",
    "👋",
    "🤚",
    "🖐️",
    "✋",
    "🖖",
    "👌",
    "🤏",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "🖕",
    "👇",
    "☝️",
    "👍",
    "👎",
    "👊",
    "✊",
    "🤛",
    "🤜",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🤝",
    "🙏",
    "✍️",
    "💅",
    "🤳",
    "💪",
    "🦾",
    "🦿",
    "🦵",
    "🦶",
    "👂",
    "🦻",
    "👃",
    "🧠",
    "🫀",
    "🫁",
    "🦷",
    "🦴",
    "👀",
    "👁️",
    "👅",
    "👄",
    "💋",
    "🩸",
    "👶",
    "🧒",
    "👦",
    "👧",
    "🧑",
  ];

  const { uploading, fileInputRef, openFileDialog, handleFileChange } =
    useFileUpload(onSendMessage);

  // Закрытие меню стикеров при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        stickerMenuRef.current &&
        !stickerMenuRef.current.contains(event.target)
      ) {
        setShowStickers(false);
      }
    };

    if (showStickers) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStickers]);

  const handleStickerClick = (sticker) => {
    setMessage((prevMessage) => prevMessage + sticker);
    setShowStickers(false);
  };

  const handleEmojiClick = () => {
    if (!disabled) {
      setShowStickers(!showStickers);
    }
  };

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
        style={{
          opacity: disabled ? 0.3 : 0.7,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onClick={handleEmojiClick}
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

      {/* Меню стикеров */}
      {showStickers && (
        <div
          ref={stickerMenuRef}
          style={{
            position: "absolute",
            bottom: "60px",
            right: "10px",
            backgroundColor: "white",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            padding: "16px",
            maxWidth: "320px",
            maxHeight: "200px",
            overflowY: "auto",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: "8px",
          }}
        >
          {stickers.map((sticker, index) => (
            <button
              key={index}
              onClick={() => handleStickerClick(sticker)}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "6px",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              {sticker}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
