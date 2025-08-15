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
          <h2>
            Benty — платформа, где бренды находят творческих профессионалов.
          </h2>
          <p>
            Погрузитесь в сообщество талантов и откройте своего идеального
            соавтора.
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
