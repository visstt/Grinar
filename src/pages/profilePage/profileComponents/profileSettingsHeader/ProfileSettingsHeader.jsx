import { useLocation, useNavigate } from "react-router-dom";

import Button from "../../../../shared/ui/components/button/Button";
import Header from "../../../../shared/ui/components/header/Header";
import { getPhotoUrl } from "../../../../shared/utils/getProjectImageUrl";
import useMainSettings from "../../hooks/useMainSettings";
import useProfileDecorSettings from "../../hooks/useProfileDecorSettings";
import useSpecializations from "../../hooks/useSpecializations";
import styles from "./ProfileSettingsHeader.module.css";

export default function ProfileSettingsHeader() {
  const { settings, loading, error } = useMainSettings();
  const { specializations, loading: specLoading } = useSpecializations();
  const location = useLocation();
  const navigate = useNavigate();
  const { coverFileName } = useProfileDecorSettings();

  let specializationNames = [];
  if (settings && specializations.length > 0 && settings.specializations) {
    specializationNames = settings.specializations
      .map((id) => {
        const found = specializations.find((s) => s.id === id);
        return found ? found.name : null;
      })
      .filter(Boolean);
  }

  // Определяем активную страницу
  const currentPath = location.pathname;

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
              backgroundImage: `url(${coverUrl}), radial-gradient(circle, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 70%), linear-gradient(150deg, #141414 23%, rgba(20, 20, 20, 0) 100%)`,
            }
          : {}
      }
    >
      <Header />
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.user_info}>
            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
            {settings && (
              <>
                <h1>
                  {settings.surname} {settings.name}
                </h1>
                <div className={styles.user_info__details}>
                  <p>
                    {specLoading
                      ? "Загрузка специализаций..."
                      : specializationNames.join(", ")}
                  </p>
                  <p>{settings.city}</p>
                </div>
              </>
            )}
          </div>
          <div className={styles.btn_wrapper}>
            <Button
              variant={
                currentPath === "/profile/profile-info"
                  ? "primary"
                  : "secondary"
              }
              onClick={() => navigate("/profile/profile-info")}
            >
              Информация
            </Button>
            <Button
              variant={
                currentPath === "/profile/profile-decor"
                  ? "primary"
                  : "secondary"
              }
              onClick={() => navigate("/profile/profile-decor")}
            >
              Оформление
            </Button>
            <Button
              variant={
                currentPath === "/profile/profile-notifications"
                  ? "primary"
                  : "secondary"
              }
              onClick={() => navigate("/profile/profile-notifications")}
            >
              Уведомления
            </Button>
            <Button
              variant={
                currentPath === "/profile/profile-account"
                  ? "primary"
                  : "secondary"
              }
              onClick={() => navigate("/profile/profile-account")}
            >
              Аккаунт
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
