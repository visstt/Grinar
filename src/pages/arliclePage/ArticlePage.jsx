import styles from "./ArticlePage.module.css";

export default function ArticlePage() {
  return (
    <div className={styles.articlePage}>
      <h1 className={styles.title}>Заголовок статьи</h1>
      <p className={styles.content}>Содержимое статьи...</p>
    </div>
  );
}
