import styles from "./WorkCard.module.css";

export default function WorkCard() {
  return (
    <div className={styles.card}>
      <div className={styles.name}>
        <p>Вакансия</p>
        <h1>SMM-специалист в Garda Wallet</h1>
      </div>
      <div className={styles.gap}>
        <div className={styles.salary}>
          <h2>от 200 000₽</h2>
          <p>Удалённо</p>
        </div>
        <div className={styles.user}>
          <img src="/public/icons/Sample_User_Icon.png" alt="user" />
          <div>
            <p>Работодатель</p>
            <h3>Tubik</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
