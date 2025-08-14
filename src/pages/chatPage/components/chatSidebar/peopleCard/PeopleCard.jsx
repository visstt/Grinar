import styles from "./PeopleCard.module.css";

export default function PeopleCard() {
  return (
    <div className={styles.peopleCard}>
      <div className={styles.avatar}>
        <img
          src="/icons/Sample_User_Icon.png"
          alt="Avatar"
          width={44}
          style={{ borderRadius: 8 }}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>
          <h2>Имя Фамилия</h2>
          <div className={styles.time}>14:23</div>
        </div>
        <div className={styles.lastMessage}>
          <p>Последнее сообщение</p>
        </div>
      </div>
    </div>
  );
}
