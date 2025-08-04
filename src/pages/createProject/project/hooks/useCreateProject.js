import { useState } from "react";

import api from "../../../../shared/api/api";

export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createProject = async ({ name, categoryId, content, coverImage }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("categoryId", categoryId.toString());
      formData.append("content", JSON.stringify(content));

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      const response = await api.post("/projects/create-projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      return response.data;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Ошибка при сохранении проекта";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    createProject,
    loading,
    error,
    success,
    resetState,
  };
}
