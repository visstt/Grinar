import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useUserStore } from "../../../../shared/store/userStore";
import Button from "../../../../shared/ui/components/button/Button";
import Header from "../../../../shared/ui/components/header/Header";
import styles from "./HomeTitle.module.css";

export default function HomeTitle() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleOpenRegistration } = useUserStore();
  const navigate = useNavigate();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });

  return (
    <div className={styles.background}>
      <Header darkBackground={true} />
      <div className="container">
        <div className={styles.wrapper}>
          <h1 style={{ textAlign: "center" }}>
            Откройте для себя лучших маркетологов
          </h1>
          <p>
            Познакомьтесь с работами талантливых и опытных специалистов, готовых
            взяться за ваш проект.
          </p>
          <div className={styles.btns}>
            <button
              className={styles.defaultBtn}
              onClick={() => navigate("/specialists")}
            >
              Найти специалиста
            </button>

            <Button
              onClick={() => {
                handleOpenRegistration();
                setMenuOpen(false);
              }}
            >
              Попробовать Benty
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
