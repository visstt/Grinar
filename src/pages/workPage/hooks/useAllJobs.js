import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export function useAllJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/advertisement/all-jobs");
        setJobs(response.data);
        console.log("[useAllJobs] jobs:", response.data);
      } catch (err) {
        setError(err);
        console.error("[useAllJobs] error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return { jobs, loading, error };
}
