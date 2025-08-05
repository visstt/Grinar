import React from "react";

import styles from "./CardPage.module.css";
import { useFetchProject } from "./hooks/useFetchProject";

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
