import React, { useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

import styles from "./Registration.module.css";
import RegistrationStep2 from "./RegistrationStep2";
import { useRegistration } from "./hooks/useRegistration";

export default function Registration() {
  const [profileTypeId, setProfileTypeId] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [policyChecked, setPolicyChecked] = useState(false);
  const [step, setStep] = useState(1);

  const { register, loading, error } = useRegistration();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register({
      profileTypeId,
      login,
      email,
      password,
      repassword,
    });
    if (res) {
      setStep(2);
    }
  };

  if (step === 2) {
    return <RegistrationStep2 email={email} />;
  }

  return (
    <div className={styles.registration_wrapper}>
      <h3>Регистрация</h3>
      <p>Выберите тип профиля</p>
      <div className={styles.btn_wrapper}>
        <button
          className={profileTypeId === 1 ? styles.active : styles.disactive}
          onClick={() => setProfileTypeId(1)}
          type="button"
        >
          Личный
        </button>
        <button
          className={profileTypeId === 2 ? styles.active : styles.disactive}
          onClick={() => setProfileTypeId(2)}
          type="button"
        >
          Компания
        </button>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input_wrapper}>
          <div className={styles.block}>
            <label>Логин</label>
            <input
              type="text"
              placeholder="Введите логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className={styles.block}>
            <label>Почта</label>
            <input
              type="email"
              placeholder="Введите почту"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.block}>
            <label>Пароль</label>
            <div className={styles.password_input_wrapper}>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                value={repassword}
                onChange={(e) => setRepassword(e.target.value)}
                required
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
          <input
            type="checkbox"
            checked={policyChecked}
            onChange={(e) => setPolicyChecked(e.target.checked)}
            id="policy"
          />
          <p>
            Я согласен с <Link>Правилами</Link> и{" "}
            <Link>Политикой конфиденциальности</Link>
          </p>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button
          className={
            !policyChecked || loading
              ? `${styles.submit_btn} ${styles.submit_btn_disabled}`
              : styles.submit_btn
          }
          disabled={!policyChecked || loading}
          type="submit"
        >
          {loading ? "Создание..." : "Создать профиль"}
        </button>
      </form>
    </div>
  );
}
