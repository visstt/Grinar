import { useState } from "react";

import api from "../../../shared/api/api";

export function useEditBlog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getBlogForEdit = async (blogId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/blog/edit-content/${blogId}`);
      console.log("Ответ сервера для редактирования блога:", response.data);
      console.log("Контент из сервера:", response.data.content);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при загрузке статьи");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (blogId, blogData) => {
    try {
      setLoading(true);
      setError(null);

      await api.put(`/blog/update-blog/${blogId}`, blogData);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при обновлении статьи");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { getBlogForEdit, updateBlog, loading, error };
}
