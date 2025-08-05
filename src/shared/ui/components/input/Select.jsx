import styles from "./Input.module.css";

export default function Select({
  label,
  id,
  options = [],
  theme = "dark",
  value,
  onChange,
  ...props
}) {
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find(
      (option) => option.value.toString() === selectedValue,
    );
    if (onChange && selectedOption) {
      onChange(selectedOption);
    }
  };

  return (
    <div
      className={`${styles.form_group} ${theme === "white" ? styles.white_theme : ""}`}
    >
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className={theme === "white" ? styles.white_theme : ""}
        value={value || ""}
        onChange={handleChange}
        {...props}
      >
        <option value="">Выберите вариант</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </div>
  );
}
