import styles from "./HomeTitle.module.css";
import Header from "../../../../shared/ui/header/Header";

export default function HomeTitle() {
  return (
    <div className={styles.background}>
      <Header />
      <div className="container">
        <div className={styles.wrapper}>
          <h1>Лучшее на GRINAR</h1>
          <p>16 октября</p>
          <button>Найти специалиста</button>
        </div>
      </div>
    </div>
  );
}
