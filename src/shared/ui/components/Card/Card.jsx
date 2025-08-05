import React, { useEffect, useState } from "react";

import {
  getProjectPhotoUrl,
  getUserLogoUrl,
} from "../../../utils/getProjectImageUrl";
import Modal from "../modal/Modal";
import styles from "./Card.module.css";
import CardPage from "./cardPage/CardPage";

export default function Card({ project }) {
  const [open, setOpen] = useState(false);

  // Блокируем/разблокируем прокрутку при открытии/закрытии модалки
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Очищаем стиль при размонтировании компонента
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!project) return null;

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
        <div className={styles.author}>
          <img
            src={getUserLogoUrl(
              project.author?.avatar || project.userLogoPhotoName,
            )}
            alt="authorLogo"
          />
          <div className={styles.author__text}>
            <h3>{project.author?.name || project.fullName}</h3>
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
