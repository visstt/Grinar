import { useEffect, useState } from "react";

import api from "../../../../shared/api/api";
import { useProfileDecorStore } from "../../../../shared/store/profileDecorStore";
import { useUserStore } from "../../../../shared/store/userStore";

export default function useProfileDecor() {
  const { decor, loading, error, setDecor, setLoading, setError } =
    useProfileDecorStore();
  const [uploading, setUploading] = useState(false);
  const setUser = useUserStore((s) => s.setUser);
  const getUser = useUserStore.getState;

  useEffect(() => {
    if (!decor) {
      setLoading(true);
      api
        .get("/user/get-decor-settings")
        .then((res) => setDecor(res.data))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, [decor, setDecor, setError, setLoading]);

  const updateAvatar = async (file) => {
    if (!file || !(file instanceof File)) {
      setError("Некорректный файл");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file, file.name);
    try {
      await api.put("/user/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Получаем обновленные данные декорации
      const res = await api.get("/user/get-decor-settings");
      setDecor(res.data);

      if (res.data?.user) {
        setUser(res.data.user);
      }

      const logoRes = await api.get("/user/get-logo");
      if (logoRes.data?.logo) {
        const prevUser = getUser().user;
        if (prevUser) {
          setUser({ ...prevUser, logoFileName: logoRes.data.logo });
        }
      }
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
    formData.append("photo", file, file.name);
    try {
      await api.put("/user/update-cover", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Получаем обновленные данные декорации и обновляем store
      const res = await api.get("/user/get-decor-settings");
      setDecor(res.data);

      if (res.data?.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      setError(err?.response?.data || err.message || err);
    } finally {
      setUploading(false);
    }
  };

  return { decor, loading, error, uploading, updateAvatar, updateCover };
}
