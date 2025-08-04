import styles from "./Input.module.css";

export default function Select({
  label,
  id,
  options = [],
  theme = "dark",
  ...props
}) {
  return (
    <div
      className={`${styles.form_group} ${theme === "white" ? styles.white_theme : ""}`}
    >
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className={theme === "white" ? styles.white_theme : ""}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </div>
  );
}
