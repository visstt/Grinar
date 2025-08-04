import React, { useState } from "react";

import { Eye, EyeOff, X } from "lucide-react";
import { Link } from "react-router-dom";

import { useUserStore } from "../../../shared/store/userStore";
import styles from "./Registration.module.css";
import RegistrationStep2 from "./RegistrationStep2";
import { useRegistration } from "./hooks/useRegistration";

export default function Registration({ onClose }) {
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
  const setUser = useUserStore((state) => state.setUser);

  // Функции для скачивания документов
  const downloadPrivacyPolicy = () => {
    const link = document.createElement("a");
    link.href = "/docs/Политика конфиденциальности.docx";
    link.download = "Политика конфиденциальности.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadUserAgreement = () => {
    const link = document.createElement("a");
    link.href = "/docs/Пользовательское соглашение.docx";
    link.download = "Пользовательское соглашение.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      setUser({ logoFileName: res.logoFileName });
      setStep(2);
    }
  };

  if (step === 2) {
    return <RegistrationStep2 email={email} />;
  }

  return (
    <div className={styles.registration_wrapper}>
      <button
        type="button"
        onClick={onClose}
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
        {error && (
          <div className={styles.error_block}>
            <X color="#ff3b3b" size={24} />
            {error}
          </div>
        )}
        <div className={styles.input_wrapper}>
          <div className={styles.block}>
            <label>Логин</label>
            <input
              type="text"
              placeholder="Введите логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className={error ? styles.input_error : undefined}
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
              className={error ? styles.input_error : undefined}
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
                className={error ? styles.input_error : undefined}
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
                className={error ? styles.input_error : undefined}
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
            Я согласен с{" "}
            <span
              onClick={downloadUserAgreement}
              style={{
                color: "#195ee6",
                cursor: "pointer",
              }}
            >
              Правилами
            </span>{" "}
            и{" "}
            <span
              onClick={downloadPrivacyPolicy}
              style={{
                color: "#195ee6",
                cursor: "pointer",
              }}
            >
              Политикой конфиденциальности
            </span>
          </p>
        </div>
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
