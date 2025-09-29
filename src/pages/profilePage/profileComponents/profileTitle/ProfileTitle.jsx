import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import Button from "../../../../shared/ui/components/button/Button";
import Header from "../../../../shared/ui/components/header/Header";
import {
  getPhotoUrl,
  getUserLogoUrl,
} from "../../../../shared/utils/getProjectImageUrl";
import useMyProfile from "../../hooks/useMyProfile";
import useProfileDecorSettings from "../../hooks/useProfileDecorSettings";
import styles from "./ProfileTtile.module.css";

export default function ProfileTitle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading, error, userId } = useMyProfile();
  const { coverFileName, logoFileName } = useProfileDecorSettings();

  if (loading) return <div>Загрузка...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>
        Ошибка: {typeof error === "string" ? error : error?.message || "Ошибка"}
      </div>
    );

  // Определяем активную вкладку по pathname
  let activeTab = "main";
  if (location.pathname.includes("/projects")) activeTab = "projects";
  else if (location.pathname.includes("/blogs")) activeTab = "blogs";
  else if (location.pathname.includes("/subscriptions"))
    activeTab = "subscriptions";
  else if (
    location.pathname.includes("/main") ||
    location.pathname === `/user/${userId}`
  )
    activeTab = "main";

  // Формируем url для cover
  const coverUrl = coverFileName
    ? getPhotoUrl("cover", coverFileName)
    : undefined;

  return (
    <div
      className={styles.background}
      style={
        coverUrl
          ? {
              backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 70%), linear-gradient(150deg, #141414 23%, rgba(20, 20, 20, 0) 100%), url(${coverUrl})`,
            }
          : {}
      }
    >
      <Header />
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.user_info}>
            <div className={styles.name_wrapper}>
              <h1>{profile.fullName}</h1>
              {profile.subscription && profile.subscription !== "default" && (
                <span
                  className={`${styles.subscription} ${styles[`subscription_${profile.subscription}`]}`}
                >
                  {profile.subscription}
                </span>
              )}
            </div>
            <div className={styles.user_info__details}>
              {profile.specialization &&
                profile.specialization !== "Специализации не указаны" && (
                  <p>{profile.specialization}</p>
                )}
              {profile.city && profile.city !== "Город не указан" && (
                <p>{profile.city}</p>
              )}
            </div>
          </div>
          <div className={styles.user_logo}>
            <img
              src={getUserLogoUrl(logoFileName || profile.logoFileName)}
              alt="userLogo"
            />
          </div>
          <div className={styles.user_stats}>
            <div className={styles.stats}>
              <div className={styles.inf}>
                <img src="/icons/star.svg" alt="star" />
                <p>{profile.favorited}</p>
              </div>
              <div className={styles.inf}>
                <img src="/icons/like.svg" alt="like" />
                <p>{profile.likes}</p>
              </div>
              <div className={styles.inf}>
                <img src="/icons/profile-2user.svg" alt="user" />
                <p>{profile.followers}</p>
              </div>
            </div>
            <div className={styles.settings}>
              <Button
                variant="secondary"
                onClick={() => navigate(`/user/${userId}/profile-info`)}
              >
                <img src="/icons/setting.svg" alt="settings" />
                <p>Настройки</p>
              </Button>
            </div>
          </div>
          <div
            className={`${styles.btn_container} ${
              !profile.city || profile.city === "Город не указан"
                ? styles.btn_container_no_city
                : ""
            }`}
          >
            <Button
              variant={activeTab === "projects" ? "primary" : "default"}
              onClick={() => navigate(`/user/${userId}/projects`)}
            >
              Проекты
            </Button>
            <Button
              variant={activeTab === "blogs" ? "primary" : "default"}
              onClick={() => navigate(`/user/${userId}/blogs`)}
            >
              Статьи
            </Button>
            <Button
              variant={activeTab === "main" ? "primary" : "default"}
              onClick={() => navigate(`/user/${userId}/main`)}
            >
              Информация
            </Button>
            <Button
              variant={activeTab === "subscriptions" ? "primary" : "default"}
              onClick={() => navigate(`/user/${userId}/subscriptions`)}
            >
              Подписки
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
