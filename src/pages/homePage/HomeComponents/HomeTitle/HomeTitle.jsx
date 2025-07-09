import Header from "../../../../shared/ui/components/header/Header";
import styles from "./HomeTitle.module.css";

export default function HomeTitle() {
  return (
    <div className={styles.background}>
      <Header />
      <div className="container">
        <div className={styles.wrapper}>
          <h1>Лучшее на BENTY</h1>
          <p>16 октября</p>
          <button>Найти специалиста</button>
        </div>
      </div>
    </div>
  );
}
