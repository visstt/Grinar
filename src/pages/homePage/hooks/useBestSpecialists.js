import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export function useBestSpecialists() {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user/best-specialists");
        setSpecialists(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, []);

  return { specialists, loading, error };
}
