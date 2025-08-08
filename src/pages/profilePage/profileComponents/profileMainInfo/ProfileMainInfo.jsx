import useMyProfile from "../../hooks/useMyProfile";
import styles from "./ProfileMainInfo.module.css";

export default function ProfileMainInfo() {
  const { profile, loading, error } = useMyProfile();

  if (loading) return <div>Загрузка...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>
        Ошибка: {typeof error === "string" ? error : error?.message || "Ошибка"}
      </div>
    );
  if (!profile) return null;

  const info = profile.info || {};

  return (
    <div className="container">
      <div className={styles.wrapper}>
        <div className={styles.block_wrapper}>
          <div className={styles.block}>
            <h1>Контакты</h1>
            <div className={styles.line_wrapper}>
              <div className={styles.line}>
                <img src="/icons/call.svg" alt="phone" width={20} />
                {info.phoneNumber || "—"}
              </div>
              <div className={styles.line}>
                <img src="/icons/sms.svg" alt="sms" width={20} />
                {info.email || "—"}
              </div>
              <div className={styles.line}>
                <img src="/icons/global.svg" alt="phone" width={20} />
                {info.website || "—"}
              </div>

              {(info.vk || info.telegram) && (
                <div className={styles.social}>
                  <p>Социальные сети:</p>
                  <div className={styles.icons}>
                    {info.vk && (
                      <a
                        href={
                          info.vk.startsWith("http")
                            ? info.vk
                            : `https://vk.com/${info.vk}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src="/icons/vk.svg" alt="vk" />
                      </a>
                    )}
                    {info.telegram && (
                      <a
                        href={
                          info.telegram.startsWith("http")
                            ? info.telegram
                            : `https://t.me/${info.telegram.replace("@", "")}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src="/icons/telegram.svg" alt="telegram" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.block_wrapper}>
          <div className={styles.block}>
            <h1>Информация</h1>
            <div className={styles.line_wrapper}>
              <div className={styles.line_city}>
                <h4>Город:</h4>
                <p>
                  {info.city && info.city !== "Город не указан"
                    ? info.city
                    : profile.city && profile.city !== "Город не указан"
                      ? profile.city
                      : "—"}
                </p>
              </div>
              <div className={styles.line_city}>
                <h4>Опыт работы:</h4>
                <p>{info.experience || "—"}</p>
              </div>
              <div className={styles.line_city}>
                <h4>Тип:</h4>
                <p>{info.type || "—"}</p>
              </div>
              <div className={styles.line_city}>
                <h4>На сайте:</h4>
                <p>{info.createdAt || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.big_wrapper + " " + styles.stretch_last}>
          <div className={styles.block}>
            <h1>О себе</h1>
            <p>{info.about || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
