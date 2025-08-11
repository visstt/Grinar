import React from "react";

import styles from "./Footer.module.css";

export default function Footer() {
  const handleLogoClick = () => {
    window.location.href = "/";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDocsClick = (e) => {
    e.preventDefault();
    window.location.href = "/docs";
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className={styles.footer}>
      <div className="container">
        <div className={styles.footer_content}>
          <div className={styles.logo_block}>
            <img
              src="/public/icons/mainLogo.svg"
              alt="main logo"
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            />
            <p>© Benty.work</p>
          </div>
          <div className={styles.wrapper_blocks}>
            <div className={styles.info_block}>
              <h2>Юр. информация</h2>
              <p>ООО «АС Технолоджи»</p>
              <p>Адрес: 109456, Россия, г. Москва, вн.тер. г. Муниципальный</p>
              <p>ОГРН 1247700757578 от 21 ноября 2024 г</p>
              <p>ИНН 9721242838</p>
              <p
                onClick={handleDocsClick}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                Пользовательское соглашение
              </p>
            </div>
            <div className={styles.nav_block}>
              <h2>Карта сайта</h2>
              <p
                onClick={() => handleNavigation("/")}
                style={{ cursor: "pointer" }}
              >
                Главная
              </p>
              <p
                onClick={() => handleNavigation("/projects")}
                style={{ cursor: "pointer" }}
              >
                Проекты
              </p>
              <p
                onClick={() => handleNavigation("/specialists")}
                style={{ cursor: "pointer" }}
              >
                Специалисты
              </p>
              <p
                onClick={() => handleNavigation("/payment")}
                style={{ cursor: "pointer" }}
              >
                Подписка
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
