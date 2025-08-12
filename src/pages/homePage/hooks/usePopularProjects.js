import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export default function usePopularProjects() {
  const [popularProjects, setPopularProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/projects/popular-projects")
      .then((res) => setPopularProjects(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { popularProjects, loading, error };
}
