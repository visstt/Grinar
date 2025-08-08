import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export const useAllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await api.get("/projects/all-projects");
        setProjects(response.data);
        setError(null);
      } catch (err) {
        setError("Ошибка при загрузке проектов");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};
