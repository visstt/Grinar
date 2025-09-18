import { useEffect, useState } from "react";

import { Eye } from "lucide-react";

import Header from "../../shared/ui/components/header/Header";
import {
  getBlogPhotoUrl,
  getUserLogoUrl,
} from "../../shared/utils/getProjectImageUrl";
import styles from "./ArticlePage.module.css";
import { useBlogById } from "./hooks/useBlogById";

export default function ArticlePage() {
  const { blog, loading, error } = useBlogById();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (textNode.backgroundColor)
      style.backgroundColor = textNode.backgroundColor;
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
              renderText(child, childIndex),
            )}
          </h1>
        );

      case "description":
        return (
          <div key={index} className={styles.description} style={elementStyle}>
            {contentItem.children?.map((child, childIndex) =>
              renderText(child, childIndex),
            )}
          </div>
        );

      case "paragraph":
        return (
          <p key={index} className={styles.paragraph} style={elementStyle}>
            {contentItem.children?.map((child, childIndex) =>
              renderText(child, childIndex),
            )}
          </p>
        );

      case "heading":
        return (
          <h2 key={index} className={styles.heading} style={elementStyle}>
            {contentItem.children?.map((child, childIndex) =>
              renderText(child, childIndex),
            )}
          </h2>
        );

      case "image":
        return (
          contentItem.url && (
            <div key={index} style={elementStyle}>
              <img
                src={contentItem.url}
                alt="Blog content"
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
              renderText(child, childIndex),
            )}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <>
        <Header darkBackground={true} />
        <div className="container">
          <div className={styles.loading}>Загрузка...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header darkBackground={true} />
        <div className="container">
          <div className={styles.error}>Ошибка: {error}</div>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Header darkBackground={true} />
        <div className="container">
          <div className={styles.error}>Статья не найдена</div>
        </div>
      </>
    );
  }

  // Парсим поле content
  let contentArray = [];
  try {
    contentArray =
      typeof blog.content === "string"
        ? JSON.parse(blog.content)
        : Array.isArray(blog.content)
          ? blog.content
          : [];
  } catch (err) {
    console.error("Ошибка парсинга content:", err);
    contentArray = [];
  }

  return (
    <>
      <Header darkBackground={true} />
      <div className="container">
        <div
          className={styles.backButton}
          onClick={() => window.history.back()}
          style={{ cursor: "pointer" }}
        >
          <img src="/icons/back_arrow.svg" alt="back arrow" />
          <p>Назад</p>
        </div>

        <div className={`${styles.user} ${isMobile ? styles.userMobile : ""}`}>
          <div
            className={styles.userInfo}
            onClick={() => {
              if (blog.user?.id) {
                window.location.href = `/user/${blog.user.id}`;
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <img
              src={getUserLogoUrl(blog.user?.logoFileName)}
              alt="user avatar"
              onError={(e) => {
                e.target.src = "/icons/Sample_User_Icon.png";
              }}
            />
            <div className={styles.userName}>
              <p>{blog.user?.fullName || "Пользователь"}</p>
              <div className={styles.userStatus}>
                <p>PRO</p>
              </div>
            </div>
          </div>
          <div className={styles.date}>
            <p>{blog.date}</p>
          </div>
        </div>

        <div className={styles.articleContent}>
          <h1 className={styles.title}>{blog.name}</h1>

          {contentArray.length > 0 ? (
            <div className={styles.content}>
              {contentArray.map((item, index) => renderContent(item, index))}
            </div>
          ) : blog.content && blog.content !== "null" ? (
            <div className={styles.content}>
              {typeof blog.content === "string" ? (
                <p>{blog.content}</p>
              ) : Array.isArray(blog.content) ? (
                blog.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>{JSON.stringify(blog.content)}</p>
              )}
            </div>
          ) : (
            <p className={styles.noContent}>Контент блога отсутствует</p>
          )}

          <div className={styles.footer}>
            <div className={styles.metrics}>
              <span className={styles.viewCount}>
                <Eye style={{ marginRight: "4px" }} /> {blog.views || 0}
              </span>
            </div>
            <button className={styles.reportButton}>Пожаловаться</button>
          </div>

          {blog.likedBy && blog.likedBy.length > 0 && (
            <div className={styles.likesSection}>
              <div className={styles.likeIcon}>
                <svg
                  width={isMobile ? "32" : "41"}
                  height={isMobile ? "32" : "40"}
                  viewBox="0 0 41 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.2803 33.2978V12.9778C13.2803 12.1778 13.5203 11.3978 13.9603 10.7378L19.4203 2.61782C20.2803 1.31782 22.4203 0.397821 24.2403 1.07782C26.2003 1.73782 27.5003 3.93782 27.0803 5.89782L26.0403 12.4378C25.9603 13.0378 26.1203 13.5778 26.4603 13.9978C26.8003 14.3778 27.3003 14.6178 27.8403 14.6178H36.0603C37.6403 14.6178 39.0003 15.2578 39.8003 16.3778C40.5603 17.4578 40.7003 18.8578 40.2003 20.2778L35.2803 35.2578C34.6603 37.7378 31.9603 39.7578 29.2803 39.7578H21.4803C20.1403 39.7578 18.2603 39.2978 17.4003 38.4378L14.8403 36.4578C13.8603 35.7178 13.2803 34.5378 13.2803 33.2978Z"
                    fill="#195EE6"
                  />
                  <path
                    d="M6.92 9.07788H4.86C1.76 9.07788 0.5 8.27788 0.5 11.2379V35.3579C0.5 38.3179 1.76 37.5179 4.86 37.5179H6.92C10.02 37.5179 11.28 38.3179 11.28 35.3579V11.2379C11.28 8.27788 10.02 9.07788 6.92 9.07788Z"
                    fill="#195EE6"
                  />
                </svg>
              </div>
              <p className={styles.likesTitle}>Оценили</p>
              <div className={styles.likedUsers}>
                {blog.likedBy.map((user) => (
                  <img
                    key={user.id}
                    src={getUserLogoUrl(user.logoFileName)}
                    alt="Liked by user"
                    className={styles.likedUserAvatar}
                    onError={(e) => {
                      e.target.src = "/icons/Sample_User_Icon.png";
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
