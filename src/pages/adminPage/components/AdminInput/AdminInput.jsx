import React, { useState } from "react";

import styles from "./AdminInput.module.css";

export default function AdminInput({
  label,
  error,
  type = "text",
  className = "",
  showPasswordToggle = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;
  const shouldShowToggle = type === "password" && showPasswordToggle;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`${styles.inputGroup} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.inputWrapper} ${isFocused ? styles.focused : ""} ${error ? styles.hasError : ""}`}
      >
        <input
          {...props}
          type={inputType}
          className={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {shouldShowToggle && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? "👁️" : "🙈"}
          </button>
        )}
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
