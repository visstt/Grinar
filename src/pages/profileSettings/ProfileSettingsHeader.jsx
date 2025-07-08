import Button from "../../shared/ui/components/button/Button";
import Header from "../../shared/ui/components/header/Header";
import styles from "./ProfileSettingsHeader.module.css";

export default function ProfileSettingsHeader() {
  return (
    <div className={styles.background}>
      <Header />
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.user_info}>
            <h1>Алексеев Александр</h1>
            <div className={styles.user_info__details}>
              <p>SMM</p>
              <p>Москва</p>
            </div>
          </div>
          <div className={styles.btn_wrapper}>
            <Button variant="primary">Информация</Button>
            <Button variant="secondary">Оформление</Button>
            <Button variant="secondary">Уведомления</Button>
            <Button variant="secondary">Аккаунт</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
