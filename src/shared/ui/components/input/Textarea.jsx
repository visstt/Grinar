import styles from "./Input.module.css";

export default function Textarea({ label, id, placeholder, ...props }) {
  return (
    <div className={styles.form_group}>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        placeholder={placeholder}
        className={styles.textarea}
        {...props}
      />
    </div>
  );
}
