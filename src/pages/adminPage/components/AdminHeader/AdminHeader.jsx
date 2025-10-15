import React, { useState } from "react";

import Button from "../../../../shared/ui/components/button/Button";
import styles from "./AdminHeader.module.css";

export default function AdminHeader({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  selectedCount,
  totalCount,
  onSelectAll,
  onBulkAction,
  actionLoading,
}) {
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [blockReason, setBlockReason] = useState("");

  const filters = [
    { value: "all", label: "Все пользователи" },
    { value: "blocked", label: "Заблокированные" },
    { value: "premium", label: "Premium" },
    { value: "pro", label: "Pro" },
  ];

  const bulkActions = [
    { value: "block", label: "Заблокировать", variant: "secondary" },
    { value: "unblock", label: "Разблокировать", variant: "primary" },
    { value: "pro", label: "Выдать Pro", variant: "primary" },
    { value: "premium", label: "Выдать Premium", variant: "primary" },
    { value: "default", label: "Убрать подписку", variant: "danger" },
    { value: "delete", label: "Удалить", variant: "danger" },
  ];

  const handleBulkAction = (action) => {
    if (action === "block") {
      setShowBlockDialog(true);
      setShowBulkActions(false);
    } else {
      onBulkAction(action);
      setShowBulkActions(false);
    }
  };

  const handleBlockConfirm = () => {
    if (blockReason.trim()) {
      onBulkAction("block", blockReason.trim());
      setShowBlockDialog(false);
      setBlockReason("");
    }
  };

  const handleBlockCancel = () => {
    setShowBlockDialog(false);
    setBlockReason("");
  };

  return (
    <div className={styles.adminHeader}>
      <div className={styles.headerTop}>
        <div className={styles.titleSection}>
          <h1>Админ панель</h1>
          <p>Управление пользователями</p>
        </div>

        <div className={styles.statsSection}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{totalCount}</span>
            <span className={styles.statLabel}>Всего пользователей</span>
          </div>
          {selectedCount > 0 && (
            <div className={styles.stat}>
              <span className={styles.statValue}>{selectedCount}</span>
              <span className={styles.statLabel}>Выбрано</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.headerControls}>
        <div className={styles.searchSection}>
          <div className={styles.searchInput}>
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={styles.searchField}
            />
            <div className={styles.searchIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.filterSection}>
          <select
            value={selectedFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className={styles.filterSelect}
          >
            {filters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.selectionSection}>
          <div className={styles.selectAllContainer}>
            <label className={styles.selectAllLabel}>
              <input
                type="checkbox"
                checked={selectedCount === totalCount && totalCount > 0}
                onChange={onSelectAll}
                className={styles.selectAllCheckbox}
                indeterminate={selectedCount > 0 && selectedCount < totalCount}
              />
              <span className={styles.selectAllText}>
                {selectedCount === totalCount && totalCount > 0
                  ? "Снять выделение"
                  : selectedCount > 0
                    ? `Выбрано ${selectedCount} из ${totalCount}`
                    : "Выбрать все"}
              </span>
            </label>
          </div>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className={styles.bulkActionsBar}>
          <div className={styles.bulkInfo}>
            <span>Выбрано {selectedCount} пользователей</span>
          </div>

          <div className={styles.bulkButtons}>
            {!showBulkActions ? (
              <Button
                variant="primary"
                onClick={() => setShowBulkActions(true)}
                disabled={actionLoading}
              >
                Массовые действия
              </Button>
            ) : (
              <div className={styles.bulkActionsMenu}>
                {bulkActions.map((action) => (
                  <Button
                    key={action.value}
                    variant={action.variant}
                    size="small"
                    onClick={() => handleBulkAction(action.value)}
                    disabled={actionLoading}
                    className={styles.bulkActionBtn}
                  >
                    {action.label}
                  </Button>
                ))}
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setShowBulkActions(false)}
                  className={styles.cancelBtn}
                >
                  Отмена
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {showBlockDialog && (
        <div className={styles.blockDialog}>
          <div className={styles.blockDialogContent}>
            <h3>Массовая блокировка пользователей</h3>
            <p>Вы собираетесь заблокировать {selectedCount} пользователей</p>
            <div className={styles.blockReasonSection}>
              <label>Причина блокировки:</label>
              <textarea
                className={styles.blockReasonInput}
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Укажите причину блокировки..."
                rows={3}
              />
            </div>
            <div className={styles.blockDialogActions}>
              <Button
                variant="secondary"
                onClick={handleBlockConfirm}
                disabled={!blockReason.trim() || actionLoading}
              >
                Заблокировать
              </Button>
              <Button
                variant="secondary"
                onClick={handleBlockCancel}
                disabled={actionLoading}
              >
                Отмена
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
