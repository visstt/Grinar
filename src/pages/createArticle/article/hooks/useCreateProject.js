import { useState } from "react";

import api from "../../../../shared/api/api";

export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProject = async ({
    name,
    description,
    categoryId,
    specializationId,
    firstLink,
    secondLink,
    content,
    coverImage,
  }) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Обязательные поля
      formData.append("name", name);
      formData.append("categoryId", String(categoryId));
      formData.append("specializationId", String(specializationId));

      // Контент как строка JSON
      formData.append("content", JSON.stringify(content));

      // Опциональные поля (добавляем только если они есть)
      if (description) formData.append("description", description);
      if (firstLink) formData.append("firstLink", firstLink);
      if (secondLink) formData.append("secondLink", secondLink);
      if (coverImage) formData.append("coverImage", coverImage);

      const response = await api.post("/projects/create-projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Ошибка при создании проекта",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error };
}
