import { useLocation, useNavigate, useParams } from "react-router-dom";

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
  const { userId } = useParams();

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
  const infoPath = `/user/${userId}/profile-info`;
  const decorPath = `/user/${userId}/profile-decor`;
  const notificationsPath = `/user/${userId}/profile-notifications`;
  const accountPath = `/user/${userId}/profile-account`;

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
              variant={currentPath === infoPath ? "primary" : "secondary"}
              onClick={() => navigate(infoPath)}
            >
              Информация
            </Button>
            <Button
              variant={currentPath === decorPath ? "primary" : "secondary"}
              onClick={() => navigate(decorPath)}
            >
              Оформление
            </Button>
            <Button
              variant={
                currentPath === notificationsPath ? "primary" : "secondary"
              }
              onClick={() => navigate(notificationsPath)}
            >
              Уведомления
            </Button>
            <Button
              variant={currentPath === accountPath ? "primary" : "secondary"}
              onClick={() => navigate(accountPath)}
            >
              Аккаунт
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
