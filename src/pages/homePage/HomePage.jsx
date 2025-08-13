import { useNavigate } from "react-router-dom";

import Specialists from "../../shared/ui/components/specialists/Specialists";
import CardsContainer from "./HomeComponents/CardsContainer/CardsContainer";
import HomeInfo from "./HomeComponents/HomeInfo/HomeInfo";
import HomeTitle from "./HomeComponents/HomeTitle/HomeTitle";
import styles from "./HomePage.module.css";
import { useBestSpecialists } from "./hooks/useBestSpecialists";

export default function HomePage() {
  const { specialists, loading, error } = useBestSpecialists();
  const navigate = useNavigate();

  return (
    <div>
      <HomeTitle />
      <CardsContainer />
      <h2 className={styles.title}>Лучшие специалисты</h2>
      {loading && <p>Загрузка...</p>}
      {error && <p>Ошибка: {error}</p>}
      {specialists.map((specialist) => (
        <Specialists key={specialist.id} specialist={specialist} />
      ))}
      <div className={styles.specialist_button_wrapper}>
        <button
          onClick={() => navigate("/specialists")}
          className={styles.specialist_button}
        >
          Все специалисты
        </button>
      </div>
      <HomeInfo />
    </div>
  );
}
