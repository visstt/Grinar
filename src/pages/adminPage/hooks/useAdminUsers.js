import { useCallback, useState } from "react";

// Это временная mock-функция для демонстрации
// В реальном проекте здесь будет API вызов
const mockUsers = [
  {
    id: 1,
    fullName: "Иван Петров",
    email: "ivan.petrov@example.com",
    logoFileName: null,
    subscription: "pro",
    isBlocked: false,
    city: "Москва",
    specialization: "Frontend разработчик",
    projectsCount: 5,
    articlesCount: 12,
    followers: 150,
    likes: 320,
    favorited: 45,
    createdAt: "2024-01-15T10:30:00Z",
    lastActivity: "2024-10-14T15:45:00Z",
  },
  {
    id: 2,
    fullName: "Анна Сидорова",
    email: "anna.sidorova@example.com",
    logoFileName: null,
    subscription: "premium",
    isBlocked: false,
    city: "Санкт-Петербург",
    specialization: "UI/UX дизайнер",
    projectsCount: 8,
    articlesCount: 6,
    followers: 230,
    likes: 580,
    favorited: 92,
    createdAt: "2024-02-20T14:20:00Z",
    lastActivity: "2024-10-15T09:15:00Z",
  },
  {
    id: 3,
    fullName: "Михаил Козлов",
    email: "mikhail.kozlov@example.com",
    logoFileName: null,
    subscription: "default",
    isBlocked: true,
    city: "Новосибирск",
    specialization: "Backend разработчик",
    projectsCount: 3,
    articlesCount: 2,
    followers: 45,
    likes: 120,
    favorited: 18,
    createdAt: "2024-03-10T11:00:00Z",
    lastActivity: "2024-09-28T16:30:00Z",
  },
  {
    id: 4,
    fullName: "Елена Волкова",
    email: "elena.volkova@example.com",
    logoFileName: null,
    subscription: "pro",
    isBlocked: false,
    city: "Екатеринбург",
    specialization: "Fullstack разработчик",
    projectsCount: 12,
    articlesCount: 25,
    followers: 380,
    likes: 920,
    favorited: 156,
    createdAt: "2023-11-05T08:45:00Z",
    lastActivity: "2024-10-15T12:20:00Z",
  },
  {
    id: 5,
    fullName: "Дмитрий Смирнов",
    email: "dmitry.smirnov@example.com",
    logoFileName: null,
    subscription: "premium",
    isBlocked: false,
    city: "Казань",
    specialization: "DevOps инженер",
    projectsCount: 7,
    articlesCount: 15,
    followers: 280,
    likes: 640,
    favorited: 112,
    createdAt: "2024-01-28T13:15:00Z",
    lastActivity: "2024-10-14T18:00:00Z",
  },
];

export default function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Имитация API вызова
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // В реальном проекте здесь будет:
      // const response = await fetch('/api/admin/users');
      // const data = await response.json();
      // setUsers(data);

      setUsers(mockUsers);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserInList = useCallback((userId, updates) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ...updates } : user,
      ),
    );
  }, []);

  const removeUserFromList = useCallback((userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserInList,
    removeUserFromList,
  };
}
