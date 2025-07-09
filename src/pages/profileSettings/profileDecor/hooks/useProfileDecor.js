import { useEffect, useState } from "react";

import api from "../../../../shared/api/api";

export default function useProfileDecor() {
  const [decor, setDecor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/user/get-decor-settings")
      .then((res) => setDecor(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const updateAvatar = async (file) => {
    if (!file || !(file instanceof File)) {
      setError("Некорректный файл");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);
    try {
      await api.put("/user/update-avatar", formData);
      // Обновить данные после загрузки
      const res = await api.get("/user/get-decor-settings");
      setDecor(res.data);
    } catch (err) {
      setError(err?.response?.data || err.message || err);
    } finally {
      setUploading(false);
    }
  };

  const updateCover = async (file) => {
    if (!file || !(file instanceof File)) {
      setError("Некорректный файл");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);
    try {
      await api.put("/user/update-cover", formData);
      // Обновить данные после загрузки
      const res = await api.get("/user/get-decor-settings");
      setDecor(res.data);
    } catch (err) {
      setError(err?.response?.data || err.message || err);
    } finally {
      setUploading(false);
    }
  };

  return { decor, loading, error, uploading, updateAvatar, updateCover };
}
