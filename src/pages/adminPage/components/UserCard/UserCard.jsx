import React, { useState } from "react";

import Button from "../../../../shared/ui/components/button/Button";
import { getUserLogoUrl } from "../../../../shared/utils/getProjectImageUrl";
import styles from "./UserCard.module.css";

export default function UserCard({
  user,
  isSelected,
  onSelect,
  onDelete,
  onBlock,
  onUnblock,
  onUpdateSubscription,
  actionLoading,
}) {
  const [showConfirm, setShowConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [showError, setShowError] = useState(false);

  const handleGoToProfile = () => {
    window.open(`/user/${user.id}`, "_blank");
  };

  const handleAction = async (action, callback) => {
    // Проверка причины блокировки
    if (action === "block" && !blockReason.trim()) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setIsLoading(true);
    try {
      if (action === "block" && blockReason.trim()) {
        await callback(blockReason.trim());
      } else {
        await callback();
      }
      setShowConfirm(null);
      setBlockReason("");
    } catch (error) {
      console.error("Ошибка при выполнении действия:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionColor = (subscription) => {
    switch (subscription) {
      case "pro":
        return styles.subscriptionPro;
      case "premium":
        return styles.subscriptionPremium;
      default:
        return styles.subscriptionDefault;
    }
  };

  const getStatusColor = (isBlocked) => {
    return isBlocked ? styles.statusBlocked : styles.statusActive;
  };

  return (
    <div className={`${styles.userCard} ${isSelected ? styles.selected : ""}`}>
      <div className={styles.cardHeader}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <img
              src={getUserLogoUrl(user.logoFileName)}
              alt={user.fullName || "Пользователь"}
            />
          </div>
          <div className={styles.userDetails}>
            <h3>{user.fullName || "Имя не указано"}</h3>
            <p className={styles.email}>{user.email}</p>
            <div className={styles.meta}>
              <span
                className={`${styles.status} ${getStatusColor(user.isBlocked)}`}
              >
                {user.activity || (user.isBlocked ? "Заблокирован" : "Активен")}
              </span>
              <span
                className={`${styles.subscription} ${getSubscriptionColor(user.subscription)}`}
              >
                {user.subscription?.toUpperCase() || "DEFAULT"}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.selectBox}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className={styles.checkbox}
          />
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Проекты</span>
            <span className={styles.statValue}>{user.projectCount || 0}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Статьи</span>
            <span className={styles.statValue}>{user.blogsCount || 0}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Подписчики</span>
            <span className={styles.statValue}>{user.followers || 0}</span>
          </div>
        </div>

        <div className={styles.additionalInfo}>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Город:</strong> {user.city || "Не указан"}
          </p>
          <p>
            <strong>Специализация:</strong>{" "}
            {user.specialization || "Не указана"}
          </p>
          <p>
            <strong>Дата регистрации:</strong>{" "}
            {user.registerDate || "Не указано"}
          </p>
        </div>

        <div className={styles.profileLinkSection}>
          <button
            className={styles.profileLink}
            onClick={handleGoToProfile}
            type="button"
          >
            Перейти в профиль →
          </button>
        </div>
      </div>

      <div className={styles.cardActions}>
        {showConfirm ? (
          <div className={styles.confirmDialog}>
            {showConfirm.action === "block" ? (
              <>
                <p>Причина блокировки:</p>
                <textarea
                  className={styles.blockReasonInput}
                  value={blockReason}
                  onChange={(e) => {
                    setBlockReason(e.target.value);
                    setShowError(false);
                  }}
                  placeholder="Укажите причину блокировки..."
                  rows={3}
                  disabled={isLoading}
                />
                {showError && (
                  <p className={styles.errorMessage}>
                    Необходимо указать причину блокировки
                  </p>
                )}
                <div className={styles.confirmActions}>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() =>
                      handleAction(showConfirm.action, showConfirm.callback)
                    }
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "Заблокировать"}
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => {
                      setShowConfirm(null);
                      setBlockReason("");
                      setShowError(false);
                    }}
                    disabled={isLoading}
                  >
                    Отмена
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p>Вы уверены?</p>
                <div className={styles.confirmActions}>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() =>
                      handleAction(showConfirm.action, showConfirm.callback)
                    }
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "Да"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setShowConfirm(null)}
                    disabled={isLoading}
                  >
                    Отмена
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className={styles.actionButtons}>
            <div className={styles.primaryActions}>
              {user.isBlocked ? (
                <Button
                  variant="primary"
                  size="small"
                  onClick={() =>
                    setShowConfirm({
                      action: "unblock",
                      callback: onUnblock,
                    })
                  }
                  disabled={actionLoading}
                >
                  Разблокировать
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() =>
                    setShowConfirm({
                      action: "block",
                      callback: onBlock,
                    })
                  }
                  disabled={actionLoading}
                >
                  Заблокировать
                </Button>
              )}

              <Button
                variant="danger"
                size="small"
                onClick={() =>
                  setShowConfirm({
                    action: "delete",
                    callback: onDelete,
                  })
                }
                disabled={actionLoading}
              >
                Удалить
              </Button>
            </div>

            <div className={styles.subscriptionActions}>
              <select
                className={styles.subscriptionSelect}
                value={user.subscription || "default"}
                onChange={(e) => onUpdateSubscription(e.target.value)}
                disabled={actionLoading}
              >
                <option value="default">Default</option>
                <option value="pro">Pro</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
