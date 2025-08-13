import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import styles from "./HomeInfo.module.css";

export default function HomeInfo() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className={styles.info_wrapper}>
        <div className={styles.info_wrapper_text}>
          <h4>Более 1 тысячи специалистов на площадке </h4>
          <h2>Найдите своего специалиста уже сегодня</h2>
          <p>
            Ведущие мировые бренды используют Benty для найма креативных
            талантов. Просмотрите миллионы портфолио с самым высоким рейтингом,
            чтобы найти идеальную творческую пару
          </p>
          <button onClick={() => navigate("/specialists")}>
            Найти специалиста
          </button>
          <p>
            Вы маркетолог? <Link>Присоединяйтесь</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
