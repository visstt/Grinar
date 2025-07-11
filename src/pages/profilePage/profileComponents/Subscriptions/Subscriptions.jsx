import React from "react";

import Specialists from "../../../../shared/ui/components/specialists/Specialists";
import styles from "./Subscriptions.module.css";

export default function Subscriptions({ subscriptions }) {
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
