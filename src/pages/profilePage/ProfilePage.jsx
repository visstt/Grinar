import Header from "../../shared/ui/components/header/Header";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  return (
    <div className={styles.background}>
      <Header />
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.user_info}>
            <h1>Алексеев Александр</h1>
            <div className={styles.user_info__details}>
              <p>SMM</p>
              <p>Москва</p>
            </div>
          </div>
          <div className={styles.user_logo}>
            <img src="/icons/userLogo.png" alt="userLogo" />
          </div>

          <div className={styles.user_stats}>
            <div className={styles.stats}>
              <div className={styles.inf} style={{ marginRight: "30px" }}>
                <img src="/public/icons/star.svg" alt="star" />
                <p>1 296</p>
              </div>
              <div className={styles.inf}>
                <img src="/public/icons/like.svg" alt="like" />
                <p>138</p>
              </div>
              <div className={styles.inf}>
                <img src="/public/icons/profile-2user.svg" alt="user" />
                <p>24</p>
              </div>
            </div>

            <div className={styles.settings}>
              <button className={styles.settingsBtn}>
                <img src="/icons/setting.svg" alt="settings" />
                <p>Настройки</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
