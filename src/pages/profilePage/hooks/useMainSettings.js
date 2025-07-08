import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export default function useMainSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/user/get-main-settings")
      .then((res) => setSettings(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading, error };
}
