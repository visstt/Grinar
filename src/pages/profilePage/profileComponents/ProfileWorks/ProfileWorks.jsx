import React, { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import WorkCard from "../../../workPage/components/workCard/WorkCard";
import WorkModal from "../../../workPage/components/workModal/WorkModal";
import styles from "./ProfileWorks.module.css";
import { useMyJobs } from "./useMyJobs";

export default function ProfileWorks() {
  const { jobs, loading, error } = useMyJobs();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCardClick = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
    console.log("handleCardClick", job.id, location.pathname);
    navigate(
      { pathname: location.pathname, search: `?job=${job.id}` },
      { replace: false },
    );
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJob(null);
    console.log("handleCloseModal", location.pathname);
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
    <div className="container">
      <div className={styles.cardsContainer}>
        {loading && <div>Загрузка...</div>}
        {error && <div>Ошибка загрузки</div>}
        {jobs.map((job) => (
          <div key={job.id} style={{ position: "relative" }}>
            <button
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                border: "none",
                borderRadius: "50%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                cursor: "pointer",
                zIndex: 2,
                padding: 0,
                transition: "box-shadow 0.15s",
              }}
              title="Добавить работу"
              onClick={() => (window.location.href = "/add-work")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block" }}
              >
                <path
                  d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25z"
                  stroke="#888"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.74 6.04a2.5 2.5 0 1 1 3.54 3.54l-1.06 1.06-3.75-3.75 1.06-1.06z"
                  stroke="#888"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <WorkCard job={job} onClick={() => handleCardClick(job)} />
          </div>
        ))}
        <WorkModal
          open={modalOpen}
          onClose={handleCloseModal}
          job={selectedJob}
        />
      </div>
    </div>
  );
}
