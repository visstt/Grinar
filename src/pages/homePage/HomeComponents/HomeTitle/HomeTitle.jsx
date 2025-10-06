import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useUserStore } from "../../../../shared/store/userStore";
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
      <Header />
      <div className="container">
        <div className={styles.wrapper}>
          <h1 style={{ textAlign: "center" }}>
            Регистрируйся — получи премиум-доступ на 3 месяца бесплатно!
          </h1>
          <p>{formattedDate}</p>
          <button
            onClick={() => {
              handleOpenRegistration();
              setMenuOpen(false);
            }}
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
}
