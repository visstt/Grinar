import React, { useEffect, useState } from "react";

import Loader from "../../shared/ui/components/Loader/Loader";
import Header from "../../shared/ui/components/header/Header";
import styles from "./AdminPage.module.css";
import AdminHeader from "./components/AdminHeader/AdminHeader";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import UserCard from "./components/UserCard/UserCard";
import useAdminActions from "./hooks/useAdminActions";
import useAdminAuth from "./hooks/useAdminAuth";
import useAdminUsers from "./hooks/useAdminUsers";

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  const { isAuthenticated, isLoading, login } = useAdminAuth();
  const { users, loading, error, fetchUsers } = useAdminUsers();
  const {
    deleteUser,
    blockUser,
    unblockUser,
    updateSubscription,
    loading: actionLoading,
  } = useAdminActions();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "blocked") return matchesSearch && user.isBlocked;
    if (selectedFilter === "premium")
      return matchesSearch && user.subscription === "premium";
    if (selectedFilter === "pro")
      return matchesSearch && user.subscription === "pro";

    return matchesSearch;
  });

  const handleSelectUser = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((user) => user.id)));
    }
  };

  const handleBulkAction = async (action, reason) => {
    const userIds = Array.from(selectedUsers);

    try {
      for (const userId of userIds) {
        switch (action) {
          case "delete":
            await deleteUser(userId);
            break;
          case "block":
            await blockUser(userId, reason || "Массовая блокировка");
            break;
          case "unblock":
            await unblockUser(userId);
            break;
          case "pro":
            await updateSubscription(userId, "pro");
            break;
          case "premium":
            await updateSubscription(userId, "premium");
            break;
          case "default":
            await updateSubscription(userId, "default");
            break;
        }
      }
      setSelectedUsers(new Set());
      await fetchUsers(); // Обновляем список пользователей
    } catch (error) {
      console.error("Ошибка при выполнении массового действия:", error);
    }
  };

  // Если загружается состояние авторизации
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loader />
      </div>
    );
  }

  // Если не авторизован, показываем форму входа
  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Header />
        <div className="container">
          <div className={styles.error}>
            <h2>Ошибка загрузки</h2>
            <p>
              {error.message || "Произошла ошибка при загрузке пользователей"}
            </p>
            <button onClick={fetchUsers} className={styles.retryButton}>
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <Header />
      <div className="container">
        <div className={styles.content}>
          <AdminHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            selectedCount={selectedUsers.size}
            totalCount={filteredUsers.length}
            onSelectAll={handleSelectAll}
            onBulkAction={handleBulkAction}
            actionLoading={actionLoading}
          />

          <div className={styles.usersGrid}>
            {filteredUsers.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>Пользователи не найдены</h3>
                <p>Попробуйте изменить параметры поиска или фильтрации</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  isSelected={selectedUsers.has(user.id)}
                  onSelect={() => handleSelectUser(user.id)}
                  onDelete={() => deleteUser(user.id).then(() => fetchUsers())}
                  onBlock={(reason) =>
                    blockUser(user.id, reason).then(() => fetchUsers())
                  }
                  onUnblock={() =>
                    unblockUser(user.id).then(() => fetchUsers())
                  }
                  onUpdateSubscription={(subscription) =>
                    updateSubscription(user.id, subscription).then(() =>
                      fetchUsers(),
                    )
                  }
                  actionLoading={actionLoading}
                />
              ))
            )}
          </div>

          {filteredUsers.length > 0 && (
            <div className={styles.pagination}>
              <p>
                Показано {filteredUsers.length} из {users.length} пользователей
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
