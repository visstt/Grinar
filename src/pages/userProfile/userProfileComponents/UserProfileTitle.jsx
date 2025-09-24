import React, { useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useUserStore } from "../../../shared/store/userStore";
import Button from "../../../shared/ui/components/button/Button";
import Header from "../../../shared/ui/components/header/Header";
import {
  getPhotoUrl,
  getUserLogoUrl,
} from "../../../shared/utils/getProjectImageUrl";
import { useUserSubscription } from "../hooks/useUserSubscription";
import styles from "./UserProfileTitle.module.css";

export default function UserProfileTitle({ userProfile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const { user } = useUserStore();
  const { subscribeToUser, unsubscribeFromUser, loading } =
    useUserSubscription();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Инициализируем состояние подписки на основе данных из API
  useEffect(() => {
    if (userProfile?.isFollow !== undefined) {
      setIsSubscribed(userProfile.isFollow);
    }
  }, [userProfile?.isFollow]);

  if (!userProfile) return null;

  // Определяем активную вкладку по pathname
  let activeTab = "main";
  if (location.pathname === `/user/${userId}/projects`) activeTab = "projects";
  else if (location.pathname === `/user/${userId}/blogs`) activeTab = "blogs";
  else if (location.pathname === `/user/${userId}/subscriptions`)
    activeTab = "subscriptions";
  else if (
    location.pathname === `/user/${userId}/main` ||
    location.pathname === `/user/${userId}`
  )
    activeTab = "main";

  const handleSubscribe = async () => {
    try {
      if (isSubscribed) {
        await unsubscribeFromUser(userId);
        setIsSubscribed(false);
        console.log("Отписались от пользователя:", userId);
      } else {
        await subscribeToUser(userId);
        setIsSubscribed(true);
        console.log("Подписались на пользователя:", userId);
      }
    } catch (error) {
      // Ошибка уже обработана в хуке
      console.error("Ошибка при изменении подписки:", error);
    }
  };

  const handleContact = () => {
    if (!user) {
      toast.error("Зарегистрируйтесь перед тем как связаться с человеком");
      return;
    }
    navigate(`/chat-page`, { state: { contactUserId: userId } });
  };

  // Формируем url для cover из профиля пользователя
  const coverUrl = userProfile?.coverFileName
    ? getPhotoUrl("cover", userProfile.coverFileName)
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
              <h1>{userProfile.fullName}</h1>
              {userProfile.subscription &&
                userProfile.subscription !== "default" && (
                  <span
                    className={`${styles.subscription} ${styles[`subscription_${userProfile.subscription}`]}`}
                  >
                    {userProfile.subscription}
                  </span>
                )}
            </div>
            <div className={styles.user_info__details}>
              {userProfile.specialization &&
                userProfile.specialization !== "Специализации не указаны" && (
                  <p>{userProfile.specialization}</p>
                )}
              {userProfile.city && userProfile.city !== "Город не указан" && (
                <p>{userProfile.city}</p>
              )}
            </div>
          </div>
          <div className={styles.user_logo}>
            <img
              src={getUserLogoUrl(userProfile.logoFileName)}
              alt="userLogo"
            />
          </div>
          <div className={styles.user_stats}>
            <div className={styles.stats}>
              <div className={styles.inf}>
                <img src="/icons/star.svg" alt="star" />
                <p>{userProfile.favorited || 0}</p>
              </div>
              <div className={styles.inf}>
                <img src="/icons/like.svg" alt="like" />
                <p>{userProfile.likes || 0}</p>
              </div>
              <div className={styles.inf}>
                <img src="/icons/profile-2user.svg" alt="user" />
                <p>{userProfile.followers || 0}</p>
              </div>
            </div>
            <div className={styles.settings}>
              <div className={styles.actionButtons}>
                <Button
                  variant={isSubscribed ? "primary" : "secondary"}
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading
                    ? "Загрузка..."
                    : isSubscribed
                      ? "Вы подписаны"
                      : "Подписаться"}
                </Button>
                <Button variant="primary" onClick={handleContact}>
                  Связаться
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.btn_container}>
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
