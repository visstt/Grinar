import { useEffect, useState } from "react";

import api from "../../../../shared/api/api";

export default function useNotificationSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/user/get-notifications-settings")
      .then((res) => setSettings(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) => {
    if (!settings) return;
    const newSettings = { ...settings, [field]: e.target.checked };
    setSettings(newSettings);
    setSaving(true);
    api
      .put("/user/update-notifications-settings", newSettings)
      .catch((err) => setError(err))
      .finally(() => setSaving(false));
  };

  return { settings, loading, saving, error, handleChange };
}
