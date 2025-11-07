import { useNavigate } from "react-router-dom";

import { useAllJobs } from "../../../workPage/hooks/useAllJobs";
import HomeJobCard from "./HomeJobCard";
import styles from "./HomeJobs.module.css";

export default function HomeJobs() {
  const navigate = useNavigate();
  const { jobs, loading, error } = useAllJobs();

  const handleViewAll = () => {
    navigate("/work");
  };

  // Берем только первые 3 карточки
  const limitedJobs = jobs.slice(0, 3);

  if (loading) {
    return (
      <div className={styles.homeJobs}>
        <div className={styles.title}>
          <h1>Работа на Benty</h1>
        </div>
        <div>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.homeJobs}>
        <div className={styles.title}>
          <h1>Работа на Benty</h1>
        </div>
        <div>Ошибка загрузки</div>
      </div>
    );
  }

  return (
    <div className={styles.homeJobs}>
      <div className={styles.title}>
        <h1>Работа на Benty</h1>
        <button onClick={handleViewAll} className={styles.viewAllBtn}>
          СМОТРЕТЬ ВСЕ
        </button>
      </div>
      <div className={styles.cards}>
        {limitedJobs.map((job) => (
          <HomeJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
