import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className="container">
        <div className={styles.footer_wrapper}>
          <p>Идея и разработка: grinar_studio</p>
          <div className={styles.group}>
            <p>Оферта</p>
            <p>Правила пользования</p>
            <p>Политика конфиденциальности</p>
            <p>Юридическая информация</p>
          </div>
        </div>
      </div>
    </div>
  );
}
