import { useLocation, useNavigate } from "react-router-dom";

import Button from "../../shared/ui/components/button/Button";
import Header from "../../shared/ui/components/header/Header";
import styles from "./CreateProjectNav.module.css";

export default function CreateProjectNav({ onPublish, isLoading }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isProjectPage = location.pathname === "/create-project";
  const isInformationPage = location.pathname === "/project-information";

  const handleProjectClick = () => {
    navigate("/create-project");
  };

  const handleInformationClick = () => {
    navigate("/project-information");
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
              {isLoading ? "Публикуется..." : "Опубликовать"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
