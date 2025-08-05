import { useEffect, useState } from "react";

import api from "../../../../../api/api";

export const useFetchProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      setLoading(true);
      try {
        const response = await api.get(`/projects/project-by-id/${projectId}`);
        setProject(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Ошибка при загрузке проекта");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return { project, loading, error };
};
