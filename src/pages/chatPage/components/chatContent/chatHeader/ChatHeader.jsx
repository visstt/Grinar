import { getUserLogoUrl } from "../../../../../shared/utils/getProjectImageUrl";
import styles from "./ChatHeader.module.css";

export default function ChatHeader({
  selectedChat,
  onBackClick,
  showBackButton,
}) {
  return (
    <div className={styles.chatHeader}>
      {showBackButton && (
        <button className={styles.backButton} onClick={onBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <div className={styles.user}>
        <img
          src={getUserLogoUrl(selectedChat?.logoFileName)}
          alt="Avatar"
          width={44}
          height={44}
          style={{ borderRadius: 8 }}
        />
        <div className={styles.userText}>
          <div className={styles.userName}>
            <h2>{selectedChat?.fullName || "Пользователь"}</h2>
          </div>
          <div className={styles.userStatus}>
            <p>В сети</p>
          </div>
        </div>
      </div>
    </div>
  );
}
