import { getUserLogoUrl } from "../../../../../shared/utils/getProjectImageUrl";
import styles from "./ChatHeader.module.css";

export default function ChatHeader({ selectedChat }) {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.user}>
        <img
          src={getUserLogoUrl(selectedChat?.logoFileName)}
          alt="Avatar"
          width={44}
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
