import React from "react";

import styles from "./Footer.module.css";

export default function Footer() {
  const downloadPrivacyPolicy = () => {
    const link = document.createElement("a");
    link.href = "/docs/Политика конфиденциальности.docx";
    link.download = "Политика конфиденциальности.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadUserAgreement = () => {
    const link = document.createElement("a");
    link.href = "/docs/Пользовательское соглашение.docx";
    link.download = "Пользовательское соглашение.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <p onClick={downloadPrivacyPolicy}>Политика конфиденциальности</p>
              <p onClick={downloadUserAgreement}>Пользовательское соглашение</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
