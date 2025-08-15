import React, { useEffect, useState } from "react";

import Button from "../button/Button";
import styles from "./CookieModal.module.css";

const CookieModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Проверяем, согласился ли пользователь ранее на использование cookie
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.text}>
          Этот сайт использует cookie для хранения данных. Продолжая
          использовать сайт, Вы даете согласие на работу с этим файлом.
        </p>
        <div className={styles.buttons}>
          <Button variant="primary" onClick={handleAccept} className={styles.accept}>
            Принять
          </Button>
          <Button variant="default" onClick={handleDecline}>
            Отклонить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieModal;
