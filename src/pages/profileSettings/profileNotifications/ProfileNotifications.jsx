import ProfileSettingsHeader from "../../profilePage/profileComponents/profileSettingsHeader/ProfileSettingsHeader";
import styles from "./ProfileNotifications.module.css";
import useNotificationSettings from "./hooks/useNotificationSettings";

export default function ProfileNotifications() {
  const { settings, loading, saving, error, handleChange } =
    useNotificationSettings();

  return (
    <div className={styles.profile_notifications_container}>
      <ProfileSettingsHeader />
      <div className={styles.profile_notifications}>
        <div className={styles.wrapper}>
          <h2>Уведомления</h2>
          <div className="stripe"></div>
          {loading ? (
            <div className={styles.form}>Загрузка...</div>
          ) : error ? (
            <div className={styles.form} style={{ color: "red" }}>
              Ошибка загрузки
            </div>
          ) : (
            <form className={styles.form}>
              <div className={styles.form_group}>
                <input
                  type="checkbox"
                  id="rewardNotifications"
                  checked={!!settings?.rewardNotifications}
                  onChange={handleChange("rewardNotifications")}
                  disabled={saving}
                />
                <label htmlFor="rewardNotifications">Награды</label>
              </div>
              <div className={styles.form_group}>
                <input
                  type="checkbox"
                  id="weeklySummaryNotifications"
                  checked={!!settings?.weeklySummaryNotifications}
                  onChange={handleChange("weeklySummaryNotifications")}
                  disabled={saving}
                />
                <label htmlFor="weeklySummaryNotifications">
                  Сводка за неделю
                </label>
              </div>
              <div className={styles.form_group}>
                <input
                  type="checkbox"
                  id="joinAuthorsNotifications"
                  checked={!!settings?.joinAuthorsNotifications}
                  onChange={handleChange("joinAuthorsNotifications")}
                  disabled={saving}
                />
                <label htmlFor="joinAuthorsNotifications">
                  Добавление в соавторы
                </label>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
