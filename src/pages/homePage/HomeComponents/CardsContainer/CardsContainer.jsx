import styles from "./CardsContainer.module.css";
import Card from "../Card/Card";

export default function CardsContainer() {
  return (
    <div className="container">
      <div className={styles.cardContainer}>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
      <h2 className={styles.title}>Популярное</h2>
      <div className={styles.cardContainer__popular}>
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}
