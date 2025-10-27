import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export function useJob(id) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchJob() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/advertisement/get-advertisement/${id}`,
        );
        setJob(response.data?.[0] || null);
        console.log("[useJob] job:", response.data?.[0]);
      } catch (err) {
        setError(err);
        console.error("[useJob] error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  return { job, loading, error };
}
