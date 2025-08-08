import React, { useState } from "react";

import { Eye, EyeOff, X } from "lucide-react";
import { toast } from "react-toastify";

import { useUserStore } from "../../../shared/store/userStore";
import ForgotPassword from "./ForgotPassword";
import styles from "./Login.module.css";
import { useLogin } from "./hooks/useLogin";
import loginBg from "/images/loginBg2.png";

export default function Login({ onSuccess, onClose, onSwitchToRegister }) {
  const handleClose = () => {
    if (onClose) onClose();
  };
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();
  const [forgot, setForgot] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  if (forgot) {
    return (
      <div className={styles.login_wrapper}>
        <button
          type="button"
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 24,
            right: 20,
            background: "rgba(255,255,255,0.08)",
            border: "none",
            borderRadius: "12px",
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 1100,
          }}
          aria-label="Закрыть"
        >
          <X color="#fff" size={20} strokeWidth={2} />
        </button>
        <ForgotPassword onSuccess={() => setForgot(false)} />
      </div>
    );
  }

  return (
    <div className={styles.login_wrapper}>
      <button
        type="button"
        onClick={handleClose}
        style={{
          position: "absolute",
          top: 24,
          right: 20,
          background: "rgba(255,255,255,0.08)",
          border: "none",
          borderRadius: "12px",
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 1100,
        }}
        aria-label="Закрыть"
      >
        <X color="#fff" size={20} strokeWidth={2} />
      </button>
      <img src={loginBg} alt="loginBg" />
      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await login(email, password);
          if (res) {
            setUser({ logoFileName: res.logoFileName });
            toast.success("Успешная авторизация!");
            if (onSuccess) onSuccess();
          }
        }}
      >
        {error && (
          <div className={styles.error_block}>
            <img src="/icons/close-circle.svg" style={{ width: 20 }} />
            Неверно указана почта или пароль
          </div>
        )}
        <label>Email</label>
        <input
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // Сбрасываем ошибку при изменении поля
            if (error) {
              // Можно добавить логику сброса ошибки если нужно
            }
          }}
          required
          className={
            error ? `${styles.input} ${styles.input_error}` : styles.input
          }
        />
        {error && (
          <div className={styles.error}>Неверно указана почта или пароль</div>
        )}
        <label>Пароль</label>
        <div className={styles.password_input_wrapper}>
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              // Сбрасываем ошибку при изменении поля
              if (error) {
                // Можно добавить логику сброса ошибки если нужно
              }
            }}
            required
            className={
              error ? `${styles.input} ${styles.input_error}` : styles.input
            }
          />
          <button
            type="button"
            className={styles.eye_button}
            onClick={() => setPasswordVisible(!passwordVisible)}
            tabIndex={-1}
          >
            {passwordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        {error && (
          <div className={styles.error}>Неверно указана почта или пароль</div>
        )}
        <p
          style={{ cursor: "pointer", marginBottom: 16 }}
          onClick={() => setForgot(true)}
        >
          Забыли пароль?
        </p>
        <button className={styles.submit_btn} disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </button>

        {/* Надпись для мобильных устройств */}
        <div className={styles.register_link}>
          Ещё нет аккаунта?{" "}
          <span
            onClick={() => onSwitchToRegister && onSwitchToRegister()}
            className={styles.register_link_text}
          >
            Зарегистрироваться
          </span>
        </div>
      </form>
    </div>
  );
}
