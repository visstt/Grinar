import React, { useState } from "react";
import styles from "./Login.module.css";
import loginBg from "/images/loginBg.png";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className={styles.login_wrapper}>
      <img src={loginBg} alt="loginBg" />
      <form className={styles.form}>
        <h3>Войти в аккаунт</h3>
        <label>Email</label>
        <input type="email" placeholder="Введите email" />
        <label>Пароль</label>
        <div className={styles.password_input_wrapper}>
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Введите пароль"
          />
          <button
            type="button"
            className={styles.eye_button}
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        <p>Забыли пароль?</p>
        <button className={styles.submit_btn}>Войти</button>
      </form>
    </div>
  );
}