import { useEffect, useState } from "react";

import api from "../../../../shared/api/api";

// Импортируем настроенный axios

export const useFetchOptions = () => {
  const [specializations, setSpecializations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [specializationResponse, categoryResponse] = await Promise.all([
          api.get("/specialization/find-all"),
          api.get("/category/find-all"),
        ]);

        setSpecializations(
          specializationResponse.data.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        );

        setCategories(
          categoryResponse.data.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        );

        setError(null);
      } catch (err) {
        setError("Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { specializations, categories, loading, error };
};
