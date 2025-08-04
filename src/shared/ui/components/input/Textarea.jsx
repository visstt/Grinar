import styles from "./Input.module.css";

export default function Textarea({
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
      <textarea
        id={id}
        placeholder={placeholder}
        className={`${styles.textarea} ${theme === "white" ? styles.white_theme : ""}`}
        {...props}
      />
    </div>
  );
}
