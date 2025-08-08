import { useNavigate } from "react-router-dom";

import Header from "../../../../shared/ui/components/header/Header";
import styles from "./HomeTitle.module.css";

export default function HomeTitle() {
  const navigate = useNavigate();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });

  return (
    <div className={styles.background}>
      <Header />
      <div className="container">
        <div className={styles.wrapper}>
          <h1>Лучшее на BENTY</h1>
          <p>{formattedDate}</p>
          <button onClick={() => navigate("/specialists")}>
            Найти специалиста
          </button>
        </div>
      </div>
    </div>
  );
}
