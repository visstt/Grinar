import { useState } from "react";

import api from "../../../shared/api/api";

export function useDeleteBlog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteBlog = async (blogId) => {
    try {
      setLoading(true);
      setError(null);

      await api.delete(`/blog/delete-blog/${blogId}`);

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при удалении статьи");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteBlog, loading, error };
}
