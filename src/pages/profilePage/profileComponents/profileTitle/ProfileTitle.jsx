import React from "react";

import { useNavigate } from "react-router-dom";

import Button from "../../../../shared/ui/components/button/Button";
import Header from "../../../../shared/ui/components/header/Header";
import { getUserLogoUrl } from "../../../../shared/utils/getProjectImageUrl";
import useMyProfile from "../../hooks/useMyProfile";
import styles from "./ProfileTtile.module.css";

export default function ProfileTitle() {
  const navigate = useNavigate();
  const { profile, loading, error } = useMyProfile();

  if (loading) return <div>Загрузка...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>
        Ошибка: {typeof error === "string" ? error : error?.message || "Ошибка"}
      </div>
    );

  return (
    <div className={styles.background}>
      <Header />
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.user_info}>
            <h1>{profile.fullName}</h1>
            <div className={styles.user_info__details}>
              <p>{profile.specialization}</p>
              <p>{profile.city}</p>
            </div>
          </div>
          <div className={styles.user_logo}>
            <img src={getUserLogoUrl(profile.logoFileName)} alt="userLogo" />
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
                onClick={() => navigate("/profile/profile-info")}
              >
                <img src="/icons/setting.svg" alt="settings" />
                <p>Настройки</p>
              </Button>
            </div>
          </div>
          <div className={styles.btn_container}>
            <Button variant="primary">Проекты</Button>
            <Button variant="default">Информация</Button>
            <Button variant="default">Подписки</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
