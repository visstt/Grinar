import { useState } from "react";

import api from "../../../../shared/api/api";

export function useCreateBlog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBlog = async ({
    name,
    specializationId,
    content,
    coverImage,
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Валидация обязательных полей
      if (!coverImage) {
        throw new Error("Обложка статьи обязательна");
      }

      console.log("useCreateBlog - received data:", {
        name,
        specializationId,
        content,
        coverImage,
      });
      console.log("useCreateBlog - coverImage type:", typeof coverImage);
      console.log(
        "useCreateBlog - coverImage instanceof File:",
        coverImage instanceof File,
      );
      console.log("useCreateBlog - coverImage name:", coverImage.name);
      console.log("useCreateBlog - coverImage size:", coverImage.size);

      const formData = new FormData();

      // Обязательные поля
      formData.append("name", name);
      formData.append("specializationId", String(specializationId));
      formData.append("coverImage", coverImage);

      // Контент как строка JSON
      formData.append("content", JSON.stringify(content));

      console.log("useCreateBlog - FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      const response = await api.post("/blog/create-blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Ошибка при создании статьи",
      );
      setLoading(false);
      throw err;
    }
  };

  return { createBlog, loading, error };
}
