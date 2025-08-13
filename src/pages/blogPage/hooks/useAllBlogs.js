import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export const useAllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/blog/all-blogs");
      setBlogs(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке блогов:", err);
      setError("Не удалось загрузить блоги");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    loading,
    error,
    refetch: fetchBlogs,
  };
};
