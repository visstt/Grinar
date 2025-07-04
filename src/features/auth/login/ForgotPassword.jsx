import React, { useRef, useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import styles from "./Login.module.css";
import { useChangePassword } from "./hooks/useChangePassword";
import { useForgotPassword } from "./hooks/useForgotPassword";
import { useVerifyPasswordCode } from "./hooks/useVerifyPasswordCode";

export default function ForgotPassword({ onSuccess }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);

  // Step 1: Email
  const [emailInput, setEmailInput] = useState("");
  const {
    sendForgotPassword,
    loading: loadingEmail,
    error: errorEmail,
  } = useForgotPassword();

  // Step 2: Code
  const inputs = Array.from({ length: 6 }, () => useRef(null));
  const [code, setCode] = useState(Array(6).fill(""));
  const {
    verifyPasswordCode,
    loading: loadingCode,
    error: errorCode,
  } = useVerifyPasswordCode();

  // Step 3: New Password
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    changePassword,
    loading: loadingPassword,
    error: errorPassword,
  } = useChangePassword();

  // Handlers
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    console.log("STEP 1: Отправка email", emailInput);
    await sendForgotPassword(emailInput);
    setEmail(emailInput);
    setStep(2);
    console.log("STEP 1: Переход на шаг 2 (код)");
  };

  const handleCodeChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if (val && idx < 5) {
      inputs[idx + 1].current.focus();
    }
  };

  const handleCodeKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (code[idx]) {
        const newCode = [...code];
        newCode[idx] = "";
        setCode(newCode);
      } else if (idx > 0) {
        inputs[idx - 1].current.focus();
        const newCode = [...code];
        newCode[idx - 1] = "";
        setCode(newCode);
        e.preventDefault();
      }
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    console.log("STEP 2: Проверка кода", code.join(""), "для email", email);
    const userIdRes = await verifyPasswordCode(email, code.join(""));
    console.log("STEP 2: Ответ userId =", userIdRes);
    if (userIdRes) {
      setUserId(userIdRes);
      setStep(3);
      console.log("STEP 2: Переход на шаг 3 (новый пароль)");
    } else {
      setCode(Array(6).fill(""));
      console.log("STEP 2: Код неверный, сброс ввода");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    console.log("STEP 3: Смена пароля для userId", userId, "пароль:", password);
    const ok = await changePassword(userId, password);
    console.log("STEP 3: Результат смены пароля:", ok);
    if (ok && onSuccess) onSuccess();
  };

  return (
    <div className={styles.login_wrapper}>
      <form
        className={styles.form}
        onSubmit={
          step === 1
            ? handleEmailSubmit
            : step === 2
              ? handleCodeSubmit
              : handlePasswordSubmit
        }
      >
        {step === 1 && (
          <>
            <h3>Восстановление пароля</h3>
            <input
              type="email"
              placeholder="Введите почту"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              className={styles.input}
            />
            {errorEmail && <div className={styles.error}>{errorEmail}</div>}
            <button
              type="submit"
              className={styles.submit_btn}
              disabled={loadingEmail}
            >
              {loadingEmail ? "Отправляем..." : "Отправить код"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3>Введите код из письма</h3>
            <div
              style={{
                display: "flex",
                gap: "6px",
                justifyContent: "center",
                margin: "30px 0",
              }}
            >
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(e, idx)}
                  onKeyDown={(e) => handleCodeKeyDown(e, idx)}
                  className={styles.input}
                  style={{
                    width: "32px",
                    height: "40px",
                    fontSize: "22px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    border: "none",
                    background: "#202020",
                    color: "#fff",
                    outline: "none",
                    fontFamily: "Unbounded, sans-serif",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    padding: 0,
                  }}
                  autoFocus={idx === 0}
                />
              ))}
            </div>
            {errorCode && <div className={styles.error}>{errorCode}</div>}
            <button
              type="submit"
              className={styles.submit_btn}
              disabled={code.some((d) => !d) || loadingCode}
            >
              {loadingCode ? "Проверяем..." : "Подтвердить"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h3>Новый пароль</h3>
            <div className={styles.password_input_wrapper}>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Введите новый пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
              <button
                type="button"
                className={styles.eye_button}
                onClick={() => setPasswordVisible((v) => !v)}
                tabIndex={-1}
              >
                {passwordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {errorPassword && (
              <div className={styles.error}>{errorPassword}</div>
            )}
            <button
              type="submit"
              className={styles.submit_btn}
              disabled={loadingPassword}
            >
              {loadingPassword ? "Сохраняем..." : "Сохранить новый пароль"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
