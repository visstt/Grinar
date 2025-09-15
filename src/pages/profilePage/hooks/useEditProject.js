import { useState } from "react";

import api from "../../../shared/api/api";

export function useEditProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProjectForEdit = async (projectId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/projects/edit-content/${projectId}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при загрузке проекта");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId, projectData) => {
    try {
      setLoading(true);
      setError(null);

      await api.put(`/projects/update-project/${projectId}`, projectData);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при обновлении проекта");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { getProjectForEdit, updateProject, loading, error };
}
