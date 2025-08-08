import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export const useAllSpecialists = () => {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecialists = async () => {
      setLoading(true);
      try {
        const response = await api.get("/user/all-specialists");
        setSpecialists(response.data);
        setError(null);
      } catch (err) {
        setError("Ошибка при загрузке специалистов");
        console.error("Error fetching specialists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, []);

  return { specialists, loading, error };
};
