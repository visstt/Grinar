import { useLocation, useNavigate } from "react-router-dom";

import Button from "../../shared/ui/components/button/Button";
import Header from "../../shared/ui/components/header/Header";
import styles from "./CreateArticleNav.module.css";

export default function CreateArticleNav({ onPublish, isLoading, isEditMode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isArticlePage = location.pathname === "/create-article";
  const isInformationPage = location.pathname === "/article-information";

  const handleArticleClick = () => {
    // Сохраняем параметр edit при переходе между вкладками
    const urlParams = new URLSearchParams(window.location.search);
    const editParam = urlParams.get("edit");
    const url = editParam
      ? `/create-article?edit=${editParam}`
      : "/create-article";
    navigate(url);
  };

  const handleInformationClick = () => {
    // Сохраняем параметр edit при переходе между вкладками
    const urlParams = new URLSearchParams(window.location.search);
    const editParam = urlParams.get("edit");
    const url = editParam
      ? `/article-information?edit=${editParam}`
      : "/article-information";
    navigate(url);
  };

  const handlePublishClick = () => {
    if (onPublish) {
      onPublish();
    }
  };
  return (
    <div className={styles.nav}>
      <div className="containerXS">
        <div
          className={styles.backButton}
          onClick={() => window.history.back()}
          style={{ cursor: "pointer" }}
        >
          <img src="/icons/back_arrow.svg" alt="back arrow" />
          <p>Назад</p>
        </div>
        <div className={styles.navButtons}>
          <div className={styles.tabButtons}>
            <Button
              variant={isArticlePage ? "primary" : "default"}
              onClick={handleArticleClick}
              className={styles.navButton}
            >
              Статья
            </Button>
            <Button
              variant={isInformationPage ? "primary" : "default"}
              onClick={handleInformationClick}
              className={styles.navButton}
            >
              Информация
            </Button>
          </div>
          {isInformationPage && (
            <Button
              variant="primary"
              className={styles.navButton}
              onClick={handlePublishClick}
              disabled={isLoading}
            >
              {isLoading
                ? isEditMode
                  ? "Обновляется..."
                  : "Публикуется..."
                : isEditMode
                  ? "Обновить"
                  : "Опубликовать"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
