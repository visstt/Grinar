import { useState } from "react";

import api from "../../../shared/api/api";

export default function useUpdateMainSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateMainSettings = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.put("/user/update-main-settings", data);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка обновления настроек");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateMainSettings, loading, error, success };
}
