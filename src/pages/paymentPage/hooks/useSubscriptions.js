import { useCallback, useEffect, useState } from "react";

import api from "../../../shared/api/api";

// Получить все подписки
export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/subscription/find-all")
      .then((res) => setSubscriptions(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { subscriptions, loading, error };
}

// Купить подписку (создать ссылку)
export function useCreatePaymentLink() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createLink = useCallback(async (subscriptionId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/payment/create-link", { subscriptionId });
      return res.data; // предполагается, что тут { link: "..." }
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createLink, loading, error };
}
