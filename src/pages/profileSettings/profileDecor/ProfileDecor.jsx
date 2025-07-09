import Button from "../../../shared/ui/components/button/Button";
import {
  getPhotoUrl,
  getUserLogoUrl,
} from "../../../shared/utils/getProjectImageUrl";
import ProfileSettingsHeader from "../../profilePage/profileComponents/profileSettingsHeader/ProfileSettingsHeader";
import styles from "./ProfileDecor.module.css";
import useProfileDecor from "./hooks/useProfileDecor";

export default function ProfileDecor() {
  const { decor, loading, error, uploading, updateAvatar, updateCover } =
    useProfileDecor();

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("handleAvatarChange file:", file, file instanceof File);
      updateAvatar(file);
    }
  };

  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("handleCoverChange file:", file, file instanceof File);
      updateCover(file);
    }
  };

  return (
    <>
      <ProfileSettingsHeader />
      <div className={styles.profile_decor}>
        <div className={styles.wrapper}>
          <h2>Фото профиля</h2>
          <div className="stripe"></div>
          <div className={styles.form}>
            <div className={styles.img_form}>
              <img
                src={getUserLogoUrl(decor?.logoFileName)}
                alt="Sample_User_Icon"
                style={{ width: 120, borderRadius: 20, marginRight: 20 }}
              />
              <label style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                Рекомендуемый размер <br />
                320x320 px
              </label>
            </div>
            <div className={styles.btn_container}>
              <label
                className={`${styles.button} ${styles.fileInput} ${styles.btn}`}
                style={{ cursor: uploading ? "not-allowed" : "pointer" }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                  disabled={uploading}
                />
                Изменить
              </label>
              <Button variant="secondary" className={styles.btn}>
                Удалить
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.wrapper}>
          <h2>Обложка профиля</h2>
          <div className="stripe"></div>
          <div className={styles.form}>
            <div className={styles.img_form2}>
              <img
                src={getPhotoUrl("cover", decor?.coverFileName)}
                alt="Sample_User_Icon"
                style={{
                  width: 900,
                  height: 300,
                  objectFit: "cover",
                  borderRadius: 20,
                }}
                className={styles.coverImage}
              />
              <label style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                Рекомендуемый размер 3200x840 px
              </label>
            </div>
            <div className={styles.btn_container}>
              <label
                className={`${styles.button} ${styles.fileInput} ${styles.btn}`}
                style={{ cursor: uploading ? "not-allowed" : "pointer" }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleCoverChange}
                  disabled={uploading}
                />
                Изменить
              </label>
              <Button variant="secondary" className={styles.btn}>
                Удалить
              </Button>
            </div>
          </div>
        </div>
        {loading && (
          <div style={{ color: "#fff", padding: 20 }}>Загрузка...</div>
        )}
        {error && (
          <div style={{ color: "red", padding: 20 }}>Ошибка загрузки</div>
        )}
      </div>
    </>
  );
}
