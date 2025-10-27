import Header from "../../shared/ui/components/header/Header";
import styles from "./WorkPage.module.css";
import WorkCard from "./components/WorkCard";

export default function WorkPage() {
  return (
    <>
      <Header />
      <div className={styles.WorkPage}>
        <div className="container">
          <h1>Работа</h1>
          <div className={styles.buttons}>
            <div className={styles.tabs}>
              <button className={styles.WorkPageButtonActive}>Все</button>
              <button className={styles.WorkPageButton}>Вакансии</button>
              <button className={styles.WorkPageButton}>Заказы</button>
            </div>
            <button className={styles.WorkPageButtonActive}>
              Разместить объявление
            </button>
          </div>
          <div className={styles.cards}>
            <WorkCard />
            <WorkCard />
            <WorkCard />
            <WorkCard />
            <WorkCard />
            <WorkCard />
          </div>
        </div>
      </div>
    </>
  );
}
