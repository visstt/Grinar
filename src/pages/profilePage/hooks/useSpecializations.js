import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export default function useSpecializations() {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/specialization/find-all")
      .then((res) => setSpecializations(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { specializations, loading, error };
}
