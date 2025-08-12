import React, { useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useUserStore } from "../../../shared/store/userStore";
import Button from "../../../shared/ui/components/button/Button";
import styles from "./Registration.module.css";
import { useVerifyEmail } from "./hooks/useVerifyEmail";

export default function RegistrationStep2({ email, onSuccess }) {
  const inputRefs = useRef([]);
  const [code, setCode] = useState(Array(6).fill(""));
  const { verifyEmail, loading, error } = useVerifyEmail();
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  // Инициализируем refs
  inputRefs.current = Array(6)
    .fill(null)
    .map((_, i) => inputRefs.current[i] || React.createRef());

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if (val && idx < 5) {
      inputRefs.current[idx + 1].current.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (code[idx]) {
        const newCode = [...code];
        newCode[idx] = "";
        setCode(newCode);
      } else if (idx > 0) {
        inputRefs.current[idx - 1].current.focus();
        const newCode = [...code];
        newCode[idx - 1] = "";
        setCode(newCode);
        e.preventDefault();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await verifyEmail(email, code.join(""));
    if (!res) {
      setCode(Array(6).fill(""));
      inputRefs.current[0].current?.focus();
    } else {
      // Сохраняем полученные токены и данные пользователя в store
      setUser(res);
      toast.success("Почта успешно подтверждена!");
      // Закрываем окно регистрации
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className={styles.registration_wrapper}>
      <div className={styles.text_wrapper}>
        <div className={styles.gap}>
          <h1 className={styles.blue}>Готово</h1>
          <h1 className={styles.white}>
            Для подтверждения аккаунта введите код из письма.
          </h1>
        </div>
        <p>
          <div className={styles.line}>
            Письмо ушло на <span className={styles.blue}>{email}</span>
          </div>
          Если письма нет — проверьте спам, рассылки или нежелательную почту.
        </p>
        <div className={styles.btn_wrapper}>
          <button className={styles.back_button} onClick={() => navigate(-1)}>
            Назад
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              gap: "12px",

              margin: "30px 0",
            }}
          >
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs.current[idx]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={styles.codeInput}
                style={{
                  width: "48px",
                  height: "56px",
                  fontSize: "32px",
                  textAlign: "center",
                  borderRadius: "8px",
                  border: "none",
                  background: "#202020",
                  color: "#fff",
                  outline: "none",
                  fontFamily: "Unbounded, sans-serif",
                  fontWeight: 700,
                  letterSpacing: "4px",
                }}
                autoFocus={idx === 0}
              />
            ))}
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button
            className={styles.submit_btn}
            type="submit"
            disabled={code.some((d) => !d) || loading}
          >
            {loading ? "Проверяем..." : "Подтвердить"}
          </button>
        </form>
      </div>
    </div>
  );
}
