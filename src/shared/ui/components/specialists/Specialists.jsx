import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../../api/api";
import { useUserStore } from "../../../store/userStore";
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
  const { user } = useUserStore();
  const [visibleCount, setVisibleCount] = useState(specialist.projects.length);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  useEffect(() => {
    if (specialist?.isFavorited !== undefined) {
      setIsFavorited(specialist.isFavorited);
    }
  }, [specialist?.isFavorited]);

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

  const handleContactClick = () => {
    if (!user) {
      toast.error("Зарегистрируйтесь перед тем как связаться с человеком");
      return;
    }
    navigate(`/chat-page`, { state: { contactUserId: specialist.id } });
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (isFavoriteLoading) return;

    setIsFavoriteLoading(true);
    try {
      if (isFavorited) {
        await api.post(`/user/unfavorite-user?userId=${specialist.id}`);
        setIsFavorited(false);
      } else {
        await api.post(`/user/favorite-user?userId=${specialist.id}`);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Ошибка при изменении избранного:", error);
    } finally {
      setIsFavoriteLoading(false);
    }
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
    <div className="container" id="specialists">
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
              <div className={styles.name_wrapper}>
                <h3>{specialist.fullName}</h3>
                {specialist.subscription &&
                  specialist.subscription !== "default" && (
                    <span
                      className={`${styles.subscription} ${styles[`subscription_${specialist.subscription}`]}`}
                    >
                      {specialist.subscription}
                    </span>
                  )}
              </div>
              {specialist.city && specialist.city !== "Город не указан" && (
                <p>
                  <img src={location} alt="location" />
                  {specialist.city}
                </p>
              )}
            </div>
          </div>
          <div className={styles.hero__btn}>
            <button
              onClick={handleFavoriteClick}
              disabled={isFavoriteLoading}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                opacity: isFavoriteLoading ? 0.6 : 1,
                filter: isFavorited ? "none" : "grayscale(100%)",
                transition: "filter 0.3s ease",
              }}
            >
              <img src={starBtn} alt="starBtn" />
            </button>
            <button className={styles.feedback} onClick={handleContactClick}>
              Связаться
            </button>
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
            <h3>{specialist.info?.rating || 0}</h3>
          </div>
          <div className={styles.group}>
            <p>Подписчики:</p>
            <h3>{specialist.info?.followers || 0}</h3>
          </div>
          {specialist.info?.website && (
            <p>
              Веб-сайт:{" "}
              <a
                href={
                  specialist.info.website.startsWith("http")
                    ? specialist.info.website
                    : `https://${specialist.info.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {specialist.info.website}
              </a>
            </p>
          )}
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
