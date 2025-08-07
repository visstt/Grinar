import React from "react";

import EmptyState from "../../../../shared/ui/components/emptyState/EmptyState";
import Specialists from "../../../../shared/ui/components/specialists/Specialists";
import styles from "./UserSubscriptions.module.css";

export default function UserSubscriptions({ subscriptions, userProfile }) {
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="Нет подписок"
        description={`${userProfile?.fullName || "Этот пользователь"} пока ни на кого не подписан`}
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
