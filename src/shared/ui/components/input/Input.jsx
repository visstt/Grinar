import styles from "./Input.module.css";

export default function Input({
  label,
  id,
  placeholder,
  theme = "dark",
  className,
  ...props
}) {
  return (
    <div
      className={`${styles.form_group} ${theme === "white" ? styles.white_theme : ""} ${className || ""}`}
    >
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        placeholder={placeholder}
        className={theme === "white" ? styles.white_theme : ""}
        {...props}
      />
    </div>
  );
}
