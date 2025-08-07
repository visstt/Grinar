import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  getProjectPhotoUrl,
  getUserLogoUrl,
} from "../../../utils/getProjectImageUrl";
import CardPage from "../Card/cardPage/CardPage";
import Modal from "../modal/Modal";
import styles from "./Specialists.module.css";
import location from "/icons/location.svg";
import starBtn from "/icons/starBtn.svg";

export default function Specialists({ specialist }) {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(specialist.projects.length);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleUserClick = () => {
    navigate(`/user/${specialist.id}`);
  };

  useEffect(() => {
    const handleResize = () => {
      const containerWidth =
        document.querySelector(`.${styles.photo_wrapper}`)?.clientWidth || 0;
      const cardWidth = 270;
      const maxCards = Math.floor(containerWidth / cardWidth);
      setVisibleCount(Math.min(maxCards, specialist.projects.length));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [specialist.projects.length]);

  return (
    <div className="container">
      <div className={styles.specialist_wrapper}>
        <div className={styles.specialist_wrapper__hero}>
          <div
            className={styles.hero__info}
            onClick={handleUserClick}
            style={{ cursor: "pointer" }}
          >
            <img
              src={getUserLogoUrl(specialist.logoFileName)}
              alt="heroAvatar"
            />
            <div className={styles.info__text}>
              <h3>{specialist.fullName}</h3>
              <p>
                <img src={location} alt="location" />
                {specialist.city}
              </p>
            </div>
          </div>
          <div className={styles.hero__btn}>
            <img src={starBtn} alt="starBtn" />
            <button className={styles.feedback}>Связаться</button>
          </div>
        </div>
        <div className={styles.photo_wrapper}>
          {specialist.projects.slice(0, visibleCount).map((project) => (
            <div
              className={styles.photo_card}
              key={project.id}
              onClick={() => handleProjectClick(project)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={getProjectPhotoUrl(project.photoName)}
                  alt={project.name}
                />
                {project.category && (
                  <span className={styles.category}>{project.category}</span>
                )}
              </div>
              <p>{project.name}</p>
            </div>
          ))}
        </div>
        <div className={styles.categories}>
          {specialist.categories.map((category, index) => (
            <p key={index}>{category}</p>
          ))}
        </div>
        <div className={styles.rating_wrapper}>
          <div className={styles.group}>
            <p>Рейтинг:</p>
            <h3>15 069</h3>
          </div>
          <div className={styles.group}>
            <p>Подписчики:</p>
            <h3>389</h3>
          </div>
          <p>
            Веб-сайт: <Link to="/">alex-smm.com</Link>
          </p>
        </div>
        <div className={styles.stripe}></div>
      </div>

      {/* Модальное окно с проектом */}
      <Modal open={isModalOpen} onClose={closeModal}>
        {selectedProject && <CardPage project={selectedProject} />}
      </Modal>
    </div>
  );
}
