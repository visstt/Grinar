import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../../../shared/api/api";

export const useBlogById = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/blog/blog-by-id/${blogId}`);
        setBlog(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Ошибка при загрузке статьи");
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  return { blog, loading, error };
};
