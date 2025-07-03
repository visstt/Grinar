import React, { useState } from "react";
import styles from "./Registration.module.css";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function Registration() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  return (
    <div className={styles.registration_wrapper}>
      <h3>Регистрация</h3>
      <p>Выберите тип профиля</p>
      <div className={styles.btn_wrapper}>
        <button className={styles.active}>Личный</button>
        <button className={styles.disactive}>Компания</button>
      </div>
      <form className={styles.form}>
        <div className={styles.input_wrapper}>
          <div className={styles.block}>
            <label>Логин</label>
            <input type="text" placeholder="Введите логин" />
          </div>
          <div className={styles.block}>
            <label>Почта</label>
            <input type="text" placeholder="Введите почту" />
          </div>
          <div className={styles.block}>
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
          </div>
          <div className={styles.block}>
            <label>Повторите пароль</label>
            <div className={styles.password_input_wrapper}>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Повторите пароль"
              />
              <button
                type="button"
                className={styles.eye_button}
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                {confirmPasswordVisible ? (
                  <Eye size={20} />
                ) : (
                  <EyeOff size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className={styles.policy_block}>
          <input type="checkbox" />
          <p>
            Я согласен с <Link>Правилами</Link> и {""}
            <Link>Политикой конфиденциальности</Link>
          </p>
        </div>
        <button className={styles.submit_btn}>Создать профиль</button>
      </form>
    </div>
  );
}