import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  getBlogPhotoUrl,
  getProjectPhotoUrl,
  getUserLogoUrl,
} from "../../../utils/getProjectImageUrl";
import Modal from "../modal/Modal";
import styles from "./Card.module.css";
import CardPage from "./cardPage/CardPage";

export default function Card({ project, blog, type = "project" }) {
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

  if (!project && !blog) return null;

  const handleAuthorClick = (e) => {
    e.stopPropagation(); // Предотвращаем открытие модального окна
    const userId = getUserId();
    if (userId) {
      navigate(`/user/${userId}`);
    }
  };

  const getUserId = () => {
    if (type === "blog") {
      return blog?.author?.id || blog?.userId || blog?.user?.id;
    }
    return project?.author?.id || project?.userId || project?.user?.id;
  };

  const getName = () => {
    return type === "blog" ? blog?.name : project?.name;
  };

  const getCoverImage = () => {
    if (type === "blog") {
      return blog?.coverImage;
    }
    return project?.coverImage || project?.projectPhotoName;
  };

  const getCategory = () => {
    if (type === "blog") {
      return blog?.category;
    }
    return project?.category;
  };

  const getAuthor = () => {
    if (type === "blog") {
      return {
        avatar: blog?.author?.avatar,
        name: blog?.author?.name,
        subscription: blog?.author?.subscription,
        specializations: blog?.author?.specializations,
      };
    }
    return {
      avatar: project?.author?.avatar || project?.userLogoPhotoName,
      name: project?.author?.name || project?.fullName,
      subscription: project?.author?.subscription,
      specializations: project?.author?.specializations || [
        project?.specialization,
      ],
    };
  };

  const handleCardClick = () => {
    if (type === "blog") {
      navigate(`/blog/blog-by-id/${blog.id}`);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <div className={styles.card} onClick={handleCardClick}>
        <div className={styles.imageWrapper}>
          <img
            src={
              type === "blog"
                ? getBlogPhotoUrl(getCoverImage())
                : getProjectPhotoUrl(getCoverImage())
            }
            alt="cardImage"
          />
          {getCategory() && (
            <span className={styles.category}>
              {typeof getCategory() === "object"
                ? getCategory().name
                : getCategory()}
            </span>
          )}
        </div>
        <h3>{getName()}</h3>
        <div
          className={styles.author}
          onClick={handleAuthorClick}
          style={{ cursor: "pointer" }}
        >
          <img src={getUserLogoUrl(getAuthor().avatar)} alt="authorLogo" />
          <div className={styles.author__text}>
            <div className={styles.author__name}>
              <h3>{getAuthor().name}</h3>
              {getAuthor().subscription &&
                getAuthor().subscription !== "default" && (
                  <span
                    className={`${styles.subscription} ${styles[`subscription_${getAuthor().subscription}`]}`}
                  >
                    {getAuthor().subscription}
                  </span>
                )}
            </div>
            <p>
              {typeof getAuthor().specializations?.[0] === "object"
                ? getAuthor().specializations?.[0]?.name
                : getAuthor().specializations?.[0]}
            </p>
          </div>
        </div>
      </div>
      {type === "project" && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <CardPage project={project} />
        </Modal>
      )}
    </>
  );
}
