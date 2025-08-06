import React from "react";

import { getUserLogoUrl } from "../../../../utils/getProjectImageUrl";
import styles from "./CardPage.module.css";
import { useFetchProject } from "./hooks/useFetchProject";
import like from "/icons/like.svg";
import location from "/icons/location.svg";

export default function CardPage({ project: initialProject }) {
  const { project, loading, error } = useFetchProject(initialProject?.id);

  // Используем данные из хука, если они есть, иначе начальные данные
  const currentProject = project || initialProject;

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;
  if (!currentProject) return null;

  // Парсим поле content, если оно строка
  let contentArray = [];
  try {
    contentArray =
      typeof currentProject.content === "string"
        ? JSON.parse(currentProject.content)
        : Array.isArray(currentProject.content)
          ? currentProject.content
          : [];
  } catch (err) {
    console.error("Ошибка парсинга content:", err);
    contentArray = [];
  }

  const renderContent = (contentItem, index) => {
    if (!contentItem?.type) return null;

    switch (contentItem.type) {
      case "image":
        return (
          contentItem.url && (
            <img
              key={index}
              src={contentItem.url}
              alt="Project content"
              className={styles.image}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.cardPageWrapper}>
      <h2 className={styles.projectTitle}>{currentProject.name}</h2>

      {/* Блок с информацией о пользователе */}
      {currentProject.user && (
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <img
              src={getUserLogoUrl(currentProject.user.logoFileName)}
              alt="User avatar"
              className={styles.userAvatar}
            />
            <div className={styles.userText}>
              <h3>{currentProject.user.fullName}</h3>
              <p>
                <img src={location} alt="location" />
                {currentProject.user.city}
              </p>
            </div>
          </div>
          <div className={styles.userActions}>
            <img src={like} alt="like" className={styles.likeBtn} />
            <button className={styles.contactBtn}>Связаться</button>
          </div>
        </div>
      )}

      {currentProject.description && (
        <p className={styles.projectDescription}>
          {currentProject.description}
        </p>
      )}
      {contentArray.length > 0 ? (
        contentArray.map((item, index) => renderContent(item, index))
      ) : (
        <p className={styles.noContent}>Контент проекта отсутствует</p>
      )}
    </div>
  );
}
