import React, { useRef } from "react";

import styles from "../../../features/auth/login/Login.module.css";

export default function ChangeLoginModal({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  code,
  setCode,
}) {
  const inputs = Array.from({ length: 6 }, () => useRef(null));
  const codeArr = code.split("").concat(Array(6 - code.length).fill(""));

  const handleCodeChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    let newCode = codeArr.slice();
    newCode[idx] = val;
    setCode(newCode.join(""));
    if (val && idx < 5) {
      inputs[idx + 1].current.focus();
    }
  };

  const handleCodeKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (codeArr[idx]) {
        let newCode = codeArr.slice();
        newCode[idx] = "";
        setCode(newCode.join(""));
      } else if (idx > 0) {
        inputs[idx - 1].current.focus();
        let newCode = codeArr.slice();
        newCode[idx - 1] = "";
        setCode(newCode.join(""));
        e.preventDefault();
      }
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <form
        className={styles.form}
        style={{
          background: "#141414",
          borderRadius: 16,
          minWidth: 320,
          maxWidth: 400,
        }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmit}
      >
        <h3>Введите код из письма</h3>
        <div
          style={{
            display: "flex",
            gap: "6px",
            justifyContent: "center",
            margin: "30px 0",
          }}
        >
          {codeArr.map((digit, idx) => (
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
        {error && <div className={styles.error}>{error}</div>}
        <button
          type="submit"
          className={styles.submit_btn}
          disabled={codeArr.some((d) => !d) || loading}
        >
          {loading ? "Проверяем..." : "Подтвердить"}
        </button>
      </form>
    </div>
  );
}
