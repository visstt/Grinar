import React from "react";

import styles from "./EmptyState.module.css";

export default function EmptyState({
  title,
  description,
  actionText,
  onAction,
}) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {actionText && onAction && (
          <button className={styles.actionButton} onClick={onAction}>
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
}
