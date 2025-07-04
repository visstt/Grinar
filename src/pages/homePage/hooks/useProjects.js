import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/project/projects-to-main-page")
      .then((res) => setProjects(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading, error };
}
