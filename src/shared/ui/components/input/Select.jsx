import styles from "./Input.module.css";

export default function Select({ label, id, options = [], ...props }) {
  return (
    <div className={styles.form_group}>
      <label htmlFor={id}>{label}</label>
      <select id={id} {...props}>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </div>
  );
}
