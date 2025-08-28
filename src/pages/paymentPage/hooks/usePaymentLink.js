import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export default function usePaymentLink() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [link, setLink] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/subscription/find-all")
      .then((res) => setSubscriptions(res.data))
      .catch((err) => setError(err?.response?.data || err.message || err))
      .finally(() => setLoading(false));
  }, []);

  const createPaymentLink = async (subscriptionId) => {
    setError(null);
    setLink("");
    try {
      const res = await api.post("/payment/create-link", { subscriptionId });
      setLink(res.data?.link || "");
      return res.data?.link;
    } catch (err) {
      setError(err?.response?.data || err.message || err);
      return null;
    }
  };

  return { subscriptions, loading, error, link, createPaymentLink };
}
