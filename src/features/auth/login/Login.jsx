import React, { useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import { useUserStore } from "../../../shared/store/userStore";
import ForgotPassword from "./ForgotPassword";
import styles from "./Login.module.css";
import { useLogin } from "./hooks/useLogin";
import loginBg from "/images/loginBg.png";

export default function Login({ onSuccess }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();
  const [forgot, setForgot] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  if (forgot) {
    return <ForgotPassword onSuccess={() => setForgot(false)} />;
  }

  return (
    <div className={styles.login_wrapper}>
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
        <h3>Войти в аккаунт</h3>

        <label>Email</label>
        <input
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />

        <label>Пароль</label>
        <div className={styles.password_input_wrapper}>
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
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

        {error && <div className={styles.error}>{error}</div>}
        <p
          style={{ cursor: "pointer", color: "#195ee6", marginBottom: 16 }}
          onClick={() => setForgot(true)}
        >
          Забыли пароль?
        </p>

        <button className={styles.submit_btn} disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
