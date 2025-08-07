import React from "react";

import styles from "./EmptyState.module.css";
import Button from "../button/Button";

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
          <Button className={styles.actionButton} onClick={onAction}>
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
}
