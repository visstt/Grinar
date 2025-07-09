import Button from "../../../../shared/ui/components/button/Button";
import Header from "../../../../shared/ui/components/header/Header";
import useMainSettings from "../../hooks/useMainSettings";
import useSpecializations from "../../hooks/useSpecializations";
import styles from "./ProfileSettingsHeader.module.css";

export default function ProfileSettingsHeader() {
  const { settings, loading, error } = useMainSettings();
  const { specializations, loading: specLoading } = useSpecializations();

  let specializationNames = [];
  if (settings && specializations.length > 0 && settings.specializations) {
    specializationNames = settings.specializations
      .map((id) => {
        const found = specializations.find((s) => s.id === id);
        return found ? found.name : null;
      })
      .filter(Boolean);
  }

  return (
    <div className={styles.background}>
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
            <Button variant="primary">Информация</Button>
            <Button variant="secondary">Оформление</Button>
            <Button variant="secondary">Уведомления</Button>
            <Button variant="secondary">Аккаунт</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
