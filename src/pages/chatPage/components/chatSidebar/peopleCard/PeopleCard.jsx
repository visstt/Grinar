import { getUserLogoUrl } from "../../../../../shared/utils/getProjectImageUrl";
import { useChat } from "../../../context/ChatContext";
import styles from "./PeopleCard.module.css";

export default function PeopleCard({ chat }) {
  const { selectChat, selectedChat } = useChat();

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClick = () => {
    selectChat(chat);
  };

  const isSelected = selectedChat?.id === chat.id;

  return (
    <div
      className={`${styles.peopleCard} ${isSelected ? styles.selected : ""}`}
      onClick={handleClick}
    >
      <div className={styles.avatar}>
        <img
          src={getUserLogoUrl(chat.logoFileName)}
          alt="Avatar"
          width={44}
          style={{ borderRadius: 8 }}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>
          <h2>{chat.fullName}</h2>
          <div className={styles.time}>
            {chat.lastMessage ? formatTime(chat.lastMessage.createdAt) : ""}
          </div>
        </div>
        <div className={styles.lastMessage}>
          <p>{chat.lastMessage ? chat.lastMessage.content : "Нет сообщений"}</p>
        </div>
      </div>
    </div>
  );
}
