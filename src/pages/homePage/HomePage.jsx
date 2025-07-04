import CardsContainer from "./HomeComponents/CardsContainer/CardsContainer";
import HomeInfo from "./HomeComponents/HomeInfo/HomeInfo";
import HomeTitle from "./HomeComponents/HomeTitle/HomeTitle";
import Specialists from "./HomeComponents/Specialists/Specialists";
import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div>
      <HomeTitle />
      <CardsContainer />
      <h2 className={styles.title}>Лучшие специалисты</h2>
      <Specialists />
      <Specialists />
      <Specialists />
      <div className={styles.specialist_button_wrapper}>
        <button className={styles.specialist_button}>Все специалисты</button>
      </div>
      <HomeInfo />
    </div>
  );
}
