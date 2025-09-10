import { useState } from "react";

import api from "../../../shared/api/api";

export function useDeleteProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteProject = async (projectId) => {
    try {
      setLoading(true);
      setError(null);

      await api.delete(`/projects/delete-project/${projectId}`);

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при удалении проекта");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProject, loading, error };
}
