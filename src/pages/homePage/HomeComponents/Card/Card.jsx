import styles from "./Card.module.css";
import cardImage from "/images/cardImage.png";
import authorLogo from "/images/authorImage.svg";

export default function Card() {
  return (
    <div className={styles.card}>
      <img src={cardImage} alt="cardImage" />
      <h3>Брендинг недвижимости Homotiq</h3>
      <div className={styles.author}>
        <img src={authorLogo} alt="authorLogo" />
        <div className={styles.author__text}>
          <h3>Halo lab</h3>
          <p>Агенство</p>
        </div>
      </div>
    </div>
  );
}
