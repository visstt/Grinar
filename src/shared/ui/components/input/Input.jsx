import styles from "./Input.module.css";

export default function Input({ label, id, placeholder, ...props }) {
  return (
    <div className={styles.form_group}>
      <label htmlFor={id}>{label}</label>
      <input id={id} placeholder={placeholder} {...props} />
    </div>
  );
}
