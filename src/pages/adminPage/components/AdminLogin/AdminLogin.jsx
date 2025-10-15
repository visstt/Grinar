import React, { useState } from "react";

import Button from "../../../../shared/ui/components/button/Button";
import AdminInput from "../AdminInput/AdminInput";
import styles from "./AdminLogin.module.css";

export default function AdminLogin({ onLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Очищаем ошибку при вводе
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Проверяем данные из env переменных
      const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

      if (!adminUsername || !adminPassword) {
        throw new Error("Админские данные не настроены");
      }

      if (
        formData.username === adminUsername &&
        formData.password === adminPassword
      ) {
        // Сохраняем состояние авторизации в localStorage
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminLoginTime", Date.now().toString());

        // Вызываем callback функцию, если она передана
        if (typeof onLogin === "function") {
          onLogin(true);
        }
      } else {
        setError("Неверный логин или пароль");
      }
    } catch (err) {
      setError(err.message || "Ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>Вход в админ панель</h1>
          <p>Введите данные для доступа к административной панели</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <AdminInput
            label="Логин"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Введите логин"
          />

          <AdminInput
            label="Пароль"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Введите пароль"
            showPasswordToggle={true}
          />

          {error && <div className={styles.error}>{error}</div>}

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || !formData.username || !formData.password}
            className={styles.submitButton}
          >
            {isLoading ? "Вход..." : "Войти"}
          </Button>
        </form>

        <div className={styles.loginFooter}>
          <p>Только для администраторов</p>
        </div>
      </div>
    </div>
  );
}
