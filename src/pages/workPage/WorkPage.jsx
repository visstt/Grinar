import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import Header from "../../shared/ui/components/header/Header";
import styles from "./WorkPage.module.css";
import WorkCard from "./components/workCard/WorkCard";
import WorkModal from "./components/workModal/WorkModal";
import { useAllJobs } from "./hooks/useAllJobs";

export default function WorkPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();
  const { jobs, loading, error } = useAllJobs();

  const handleAddWorkClick = () => {
    navigate("/add-work");
  };

  const handleCardClick = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJob(null);
  };

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
