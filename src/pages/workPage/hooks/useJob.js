import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export function useJob(id) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      console.log("[useJob] No id provided:", id);
      return;
    }
    console.log("[useJob] Fetching job with id:", id);
    async function fetchJob() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/advertisement/get-advertisement/${id}`,
        );
        console.log("[useJob] API response:", response.data);
        setJob(response.data || null);
        console.log("[useJob] job:", response.data);
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
