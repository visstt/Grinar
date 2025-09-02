import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/api";
import { getUserLogoUrl } from "../../../../utils/getProjectImageUrl";
import Card from "../Card";
import styles from "./CardPage.module.css";
import { useFetchProject } from "./hooks/useFetchProject";
import like from "/icons/like.svg";
import location from "/icons/location.svg";

export default function CardPage({ project: initialProject }) {
  const navigate = useNavigate();
  const { project, loading, error } = useFetchProject(initialProject?.id);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const currentProject = project || initialProject;

  useEffect(() => {
    if (currentProject?.isLiked !== undefined) {
      setIsLiked(currentProject.isLiked);
    }
  }, [currentProject?.isLiked]);

  const handleLike = async () => {
    if (!currentProject?.id || isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      if (isLiked) {
        await api.post(`/projects/unlike-project/${currentProject.id}`);
        setIsLiked(false);
      } else {
        await api.post(`/projects/like-project/${currentProject.id}`);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Ошибка при лайке проекта:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleContact = () => {
    if (currentProject?.user?.id) {
      navigate(`/chat-page`, {
        state: { contactUserId: currentProject.user.id },
      });
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;
  if (!currentProject) return null;

  // Парсим поле content
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

  // Функция для рендеринга текста со стилями
  // Функция для рендеринга текста со стилями
const renderText = (textNode, index) => {
  if (!textNode?.text) return null;

  let element = textNode.text;

  // Применяем стили
  if (textNode.bold) element = <strong key={index}>{element}</strong>;
  if (textNode.italic) element = <em key={index}>{element}</em>;
  if (textNode.underline) element = <u key={index}>{element}</u>;

  // Применяем все возможные стили
  const style = {};
  if (textNode.color) style.color = textNode.color;
  if (textNode.fontSize) style.fontSize = `${textNode.fontSize}px`;
  if (textNode.fontFamily) style.fontFamily = textNode.fontFamily;
  if (textNode.backgroundColor) style.backgroundColor = textNode.backgroundColor;
  if (textNode.textAlign) style.textAlign = textNode.textAlign;
  if (textNode.lineHeight) style.lineHeight = textNode.lineHeight;
  if (textNode.letterSpacing) style.letterSpacing = textNode.letterSpacing;
  if (textNode.textDecoration) style.textDecoration = textNode.textDecoration;

  return (
    <span key={index} style={style}>
      {element}
    </span>
  );
};

  // Функция для рендеринга контента
  // Функция для рендеринга контента
const renderContent = (contentItem, index) => {
  if (!contentItem) return null;

  // Создаем стили для элемента
  const elementStyle = {};
  if (contentItem.align) elementStyle.textAlign = contentItem.align;
  if (contentItem.style) Object.assign(elementStyle, contentItem.style);

  switch (contentItem.type) {
    case "title":
      return (
        <h1 key={index} className={styles.title} style={elementStyle}>
          {contentItem.children?.map((child, childIndex) =>
            renderText(child, childIndex)
          )}
        </h1>
      );

    case "description":
      return (
        <div key={index} className={styles.description} style={elementStyle}>
          {contentItem.children?.map((child, childIndex) =>
            renderText(child, childIndex)
          )}
        </div>
      );

    case "paragraph":
      return (
        <p key={index} className={styles.paragraph} style={elementStyle}>
          {contentItem.children?.map((child, childIndex) =>
            renderText(child, childIndex)
          )}
        </p>
      );

    case "heading":
      return (
        <h2 key={index} className={styles.heading} style={elementStyle}>
          {contentItem.children?.map((child, childIndex) =>
            renderText(child, childIndex)
          )}
        </h2>
      );

    case "image":
      return (
        contentItem.url && (
          <div key={index} style={elementStyle}>
            <img
              src={contentItem.url}
              alt="Project content"
              className={styles.image}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )
      );

    case "video":
      return (
        contentItem.url && (
          <div key={index} style={elementStyle}>
            <video
              src={contentItem.url}
              controls
              className={styles.video}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )
      );

    default:
      // Для неизвестных типов пытаемся отобразить текст
      return (
        <div key={index} style={elementStyle}>
          {contentItem.children?.map((child, childIndex) =>
            renderText(child, childIndex)
          )}
        </div>
      );
  }
};
  return (
    <div className={styles.cardPageWrapper}>
      {/* Заголовок проекта */}
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
            <button
              onClick={handleLike}
              disabled={isLikeLoading}
              className={`${styles.likeBtn} ${isLiked ? styles.likeBtnActive : ""}`}
            >
              <img src={like} alt="like" />
            </button>
            <button className={styles.contactBtn} onClick={handleContact}>
              Связаться
            </button>
          </div>
        </div>
      )}

      {/* Основной контент проекта */}
      <div className={styles.projectContent}>
        {contentArray.length > 0 ? (
          contentArray.map((item, index) => renderContent(item, index))
        ) : (
          <p className={styles.noContent}>Контент проекта отсутствует</p>
        )}
      </div>

      {/* Блок с лайками */}
      {currentProject.likedBy && currentProject.likedBy.length > 0 && (
        <div className={styles.likesSection}>
          <div className={styles.likeIcon}>
            <svg
              width="41"
              height="40"
              viewBox="0 0 41 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.2803 33.2978V12.9778C13.2803 12.1778 13.5203 11.3978 13.9603 10.7378L19.4203 2.61782C20.2803 1.31782 22.4203 0.397821 24.2403 1.07782C26.2003 1.73782 27.5003 3.93782 27.0803 5.89782L26.0403 12.4378C25.9603 13.0378 26.1203 13.5778 26.4603 13.9978C26.8003 14.3778 27.3003 14.6178 27.8403 14.6178H36.0603C37.6403 14.6178 39.0003 15.2578 39.8003 16.3778C40.5603 17.4578 40.7003 18.8578 40.2003 20.2778L35.2803 35.2578C34.6603 37.7378 31.9603 39.7578 29.2803 39.7578H21.4803C20.1403 39.7578 18.2603 39.2978 17.4003 38.4378L14.8403 36.4578C13.8603 35.7178 13.2803 34.5378 13.2803 33.2978Z"
                fill="white"
              />
              <path
                d="M6.92 9.07788H4.86C1.76 9.07788 0.5 8.27788 0.5 11.2379V35.3579C0.5 38.3179 1.76 37.5179 4.86 37.5179H6.92C10.02 37.5179 11.28 38.3179 11.28 35.3579V11.2379C11.28 8.27788 10.02 9.07788 6.92 9.07788Z"
                fill="white"
              />
            </svg>
          </div>
          <p className={styles.likesTitle}>Оценили</p>
          <div className={styles.likedUsers}>
            {currentProject.likedBy.map((user) => (
              <img
                key={user.id}
                src={getUserLogoUrl(user.logoFileName)}
                alt="Liked by user"
                className={styles.likedUserAvatar}
              />
            ))}
          </div>
        </div>
      )}

      {/* Блок с другими проектами пользователя */}
      {currentProject.projects && currentProject.projects.length > 0 && (
        <div className={styles.userProjects}>
          <h3 className={styles.userProjectsTitle}>
            Проекты {currentProject.user?.fullName || currentProject.fullName}
          </h3>
          <div className={styles.projectsGrid}>
            {currentProject.projects
              .filter((project) => project.id !== currentProject.id)
              .map((project) => (
                <Card
                  key={project.id}
                  project={{
                    ...project,
                    projectPhotoName: project.photoName,
                    userLogoPhotoName: project.userLogo,
                    fullName: project.fullName,
                    specialization: project.category,
                  }}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}