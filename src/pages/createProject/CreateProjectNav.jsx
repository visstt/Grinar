import { useMemo } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import Button from "../../shared/ui/components/button/Button";
import Header from "../../shared/ui/components/header/Header";
import styles from "./CreateProjectNav.module.css";

export default function CreateProjectNav({ onPublish, isLoading }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isProjectPage = location.pathname === "/create-project";
  const isInformationPage = location.pathname === "/project-information";

  // Проверяем, находимся ли в режиме редактирования
  const isEditMode = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("edit") !== null;
  }, []);

  const handleProjectClick = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const editParam = urlParams.get("edit");
    const editQuery = editParam ? `?edit=${editParam}` : "";
    navigate(`/create-project${editQuery}`);
  };

  const handleInformationClick = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const editParam = urlParams.get("edit");
    const editQuery = editParam ? `?edit=${editParam}` : "";
    navigate(`/project-information${editQuery}`);
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
              variant={isProjectPage ? "primary" : "default"}
              onClick={handleProjectClick}
              className={styles.navButton}
            >
              Проект
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
                  ? "Сохраняется..."
                  : "Публикуется..."
                : isEditMode
                  ? "Сохранить"
                  : "Опубликовать"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
