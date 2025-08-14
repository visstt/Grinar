import styles from "./ChatHeader.module.css";

export default function ChatHeader() {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.user}>
        <img
          src="/icons/Sample_User_Icon.png"
          alt="Avatar"
          width={44}
          style={{ borderRadius: 8 }}
        />
        <div className={styles.userText}>
          <div className={styles.userName}>
            <h2>Имя Фамилия</h2>
          </div>
          <div className={styles.userStatus}>
            <p>В сети</p>
          </div>
        </div>
      </div>
    </div>
  );
}
