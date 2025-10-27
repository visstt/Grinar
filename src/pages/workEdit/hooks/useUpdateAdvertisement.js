import { useState } from "react";

import api from "../../../shared/api/api";

export function useUpdateAdvertisement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateAdvertisement = async (id, data, file) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });
      const response = await api.patch(
        `/advertisement/update-advertisement/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateAdvertisement, loading, error, success };
}
