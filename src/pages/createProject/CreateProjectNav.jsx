import Button from "../../shared/ui/components/button/Button";
import Header from "../../shared/ui/components/header/Header";
import styles from "./CreateProjectNav.module.css";

export default function CreateProjectNav() {
  return (
    <div className={styles.nav}>
      <Header darkBackground={true} />
      <div className="containerXS">
        <div
          className={styles.backButton}
          onClick={() => window.history.back()}
          style={{ cursor: "pointer" }}
        >
          <img src="/icons/back_arrow.svg" alt="back arrow" />
          <p>Назад</p>
        </div>
        <div className={styles.navButtons}>
          <Button variant="primary">Проект</Button>
          <Button variant="default">Информация</Button>
        </div>
      </div>
    </div>
  );
}
