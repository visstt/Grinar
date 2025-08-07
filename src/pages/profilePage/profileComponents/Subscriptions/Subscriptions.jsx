import React from "react";

import EmptyState from "../../../../shared/ui/components/emptyState/EmptyState";
import Specialists from "../../../../shared/ui/components/specialists/Specialists";
import styles from "./Subscriptions.module.css";

export default function Subscriptions({ subscriptions }) {
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="Нет подписок"
        description="Вы пока ни на кого не подписаны. Найдите интересных специалистов и следите за их работами"
        actionText="Найти специалистов"
        onAction={() => (window.location.href = "/")}
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {subscriptions.map((user) => (
          <Specialists
            key={user.id}
            specialist={{
              ...user,
              projects: Array.isArray(user.projects) ? user.projects : [],
              categories: Array.isArray(user.categories) ? user.categories : [],
            }}
          />
        ))}
      </div>
    </div>
  );
}
