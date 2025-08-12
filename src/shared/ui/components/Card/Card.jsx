import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  getProjectPhotoUrl,
  getUserLogoUrl,
} from "../../../utils/getProjectImageUrl";
import Modal from "../modal/Modal";
import styles from "./Card.module.css";
import CardPage from "./cardPage/CardPage";

export default function Card({ project }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  if (!project) return null;

  const handleAuthorClick = (e) => {
    e.stopPropagation(); // Предотвращаем открытие модального окна проекта
    const userId = getUserId();
    if (userId) {
      navigate(`/user/${userId}`);
    }
  };

  const getUserId = () => {
    return project.author?.id || project.userId || project.user?.id;
  };

  return (
    <>
      <div className={styles.card} onClick={() => setOpen(true)}>
        <div className={styles.imageWrapper}>
          <img
            src={getProjectPhotoUrl(
              project.coverImage || project.projectPhotoName,
            )}
            alt="cardImage"
          />
          {project.category && (
            <span className={styles.category}>
              {project.category.name || project.category}
            </span>
          )}
        </div>
        <h3>{project.name}</h3>
        <div className={styles.author} onClick={handleAuthorClick}>
          <img
            src={getUserLogoUrl(
              project.author?.avatar || project.userLogoPhotoName,
            )}
            alt="authorLogo"
          />
          <div className={styles.author__text}>
            <div className={styles.author__name}>
              <h3>{project.author?.name || project.fullName}</h3>
              {project.author?.subscription &&
                project.author.subscription !== "default" && (
                  <span
                    className={`${styles.subscription} ${styles[`subscription_${project.author.subscription}`]}`}
                  >
                    {project.author.subscription}
                  </span>
                )}
            </div>
            <p>
              {project.author?.specializations?.[0] || project.specialization}
            </p>
          </div>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <CardPage project={project} />
      </Modal>
    </>
  );
}
