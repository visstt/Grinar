import React, { useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import Button from "../../../shared/ui/components/button/Button";
import Header from "../../../shared/ui/components/header/Header";
import { getUserLogoUrl } from "../../../shared/utils/getProjectImageUrl";
import { useUserSubscription } from "../hooks/useUserSubscription";
import styles from "./UserProfileTitle.module.css";

export default function UserProfileTitle({ userProfile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
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
    // TODO: Реализовать связь с пользователем
    console.log("Связаться с пользователем:", userId);
  };

  return (
    <div className={styles.background}>
      <Header />
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.user_info}>
            <h1>{userProfile.fullName}</h1>
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
