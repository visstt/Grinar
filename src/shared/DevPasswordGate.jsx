import React, { useState } from "react";

import styles from "./DevPasswordGate.module.css";

const DEV_PASSWORD = import.meta.env.VITE_DEV_PASSWORD;

export default function DevPasswordGate({ children }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState(() => {
    return localStorage.getItem("dev_auth") === DEV_PASSWORD;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === DEV_PASSWORD) {
      localStorage.setItem("dev_auth", DEV_PASSWORD);
      setAuthorized(true);
      setError("");
    } else {
      setError("Неверный пароль");
    }
  };

  if (!authorized) {
    return (
      <div className={styles.devGateBg}>
        <form className={styles.devGateForm} onSubmit={handleSubmit}>
          <h2>Доступ к сайту только для разработчиков</h2>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите пароль"
            className={styles.devGateInput}
          />
          <button type="submit" className={styles.devGateBtn}>
            Войти
          </button>
          {error && <div className={styles.devGateError}>{error}</div>}
        </form>
      </div>
    );
  }

  return children;
}
