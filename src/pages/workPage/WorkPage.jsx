import React, { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../shared/ui/components/header/Header";
import styles from "./WorkPage.module.css";
import WorkCard from "./components/workCard/WorkCard";
import WorkModal from "./components/workModal/WorkModal";
import { useAllJobs } from "./hooks/useAllJobs";

export default function WorkPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { jobs, loading, error } = useAllJobs();

  const handleAddWorkClick = () => {
    navigate("/add-work");
  };

  const handleCardClick = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
    navigate(
      { pathname: location.pathname, search: `?job=${job.id}` },
      { replace: false },
    );
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJob(null);
    navigate({ pathname: location.pathname }, { replace: false });
  };

  // Открывать модалку по наличию job в url
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jobId = params.get("job");
    if (jobId && jobs.length) {
      const found = jobs.find((j) => String(j.id) === String(jobId));
      if (found) {
        setSelectedJob(found);
        setModalOpen(true);
      }
    }
  }, [location.search, jobs]);

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
            <button
              className={styles.WorkPageButtonActive}
              onClick={handleAddWorkClick}
            >
              Разместить объявление
            </button>
          </div>
          <div className={styles.cards}>
            {loading && <div>Загрузка...</div>}
            {error && <div>Ошибка загрузки</div>}
            {jobs.map((job) => (
              <WorkCard
                key={job.id}
                job={job}
                onClick={() => handleCardClick(job)}
              />
            ))}
          </div>
        </div>
      </div>
      <WorkModal
        open={modalOpen}
        onClose={handleCloseModal}
        job={selectedJob}
      />
    </>
  );
}
