import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import styles from "./Specialists.module.css";
import location from "/icons/location.svg";
import starBtn from "/icons/starBtn.svg";
import heroAvatar from "/images/heroAvatar.png";
import specImage from "/images/specImage.png";

const images = [
  { src: specImage, alt: "specImage", text: "Брендинг Monly" },
  { src: specImage, alt: "specImage", text: "Брендинг Monly" },
  { src: specImage, alt: "specImage", text: "Брендинг Monly" },
  { src: specImage, alt: "specImage", text: "Брендинг Monly" },
];

export default function Specialists() {
  const [visibleCount, setVisibleCount] = useState(images.length);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth =
        document.querySelector(`.${styles.photo_wrapper}`)?.clientWidth || 0;
      const cardWidth = 270;
      const maxCards = Math.floor(containerWidth / cardWidth);
      setVisibleCount(Math.min(maxCards, images.length));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container">
      <div className={styles.specialist_wrapper}>
        <div className={styles.specialist_wrapper__hero}>
          <div className={styles.hero__info}>
            <img src={heroAvatar} alt="heroAvatar" />
            <div className={styles.info__text}>
              <h3>Александр Алексеев</h3>
              <p>
                <img src={location} alt="location" />
                Москва
              </p>
            </div>
          </div>
          <div className={styles.hero__btn}>
            <img src={starBtn} alt="starBtn" />
            <button className={styles.feedback}>Связаться</button>
          </div>
        </div>
        <div className={styles.photo_wrapper}>
          {images.slice(0, visibleCount).map((item, index) => (
            <div className={styles.photo_card} key={index}>
              <img src={item.src} alt={item.alt} />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
        <div className={styles.categories}>
          <p>Одежда и косметика</p>
          <p>Косметология</p>
          <p>Медицина</p>
          <p>IT-разработка</p>
        </div>
        <div className={styles.rating_wrapper}>
          <p>Рейтинг:</p>
          <h3>15 069</h3>

          <p>Подписчики:</p>
          <h3>389</h3>

          <p>
            Веб-сайт:<Link to="/">alex-smm.com</Link>
          </p>
        </div>
        <div className={styles.stripe}></div>
      </div>
    </div>
  );
}
