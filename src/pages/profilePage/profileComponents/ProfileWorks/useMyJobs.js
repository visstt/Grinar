import { useEffect, useState } from "react";

import api from "../../../../shared/api/api";

export function useMyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/advertisement/get-my-jobs");
        setJobs(response.data);
        console.log("[useMyJobs] jobs:", response.data);
      } catch (err) {
        setError(err);
        console.error("[useMyJobs] error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return { jobs, loading, error };
}
