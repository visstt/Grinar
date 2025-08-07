import React from "react";

import styles from "./Footer.module.css";

export default function Footer() {
  const handleDocsClick = (e) => {
    e.preventDefault();
    window.location.href = "/docs";
  };

  return (
    <div className={styles.footer}>
      <div className="container">
        <div className={styles.footer_wrapper}>
          <div className={styles.group}>
            <div className={styles.companyInfo}>
              <p>ООО «АС Технолоджи»</p>
              <p>
                Адрес: 109456, Россия, г. Москва, вн.тер. г. Муниципальный Округ
                Рязанский, проезд 4-й Вешняковский, д. 8, стр.2
              </p>
              <p>ИНН 9721242838</p>
              <p>ОГРН 1247700757578 от 21 ноября 2024 г</p>
            </div>
            <div className={styles.links}>
              <a
                href="/docs"
                onClick={handleDocsClick}
                style={{
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Пользовательское соглашение
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
