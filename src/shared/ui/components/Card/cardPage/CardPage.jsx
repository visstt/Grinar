import styles from "./CardPage.module.css";

export default function CardPage({ project }) {
  if (!project) return null;
  return (
    <div className={styles.cardPageWrapper}>
      <h2>{project.name}</h2>
    </div>
  );
}
