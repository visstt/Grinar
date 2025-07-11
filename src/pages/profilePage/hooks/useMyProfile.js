import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export default function useMyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/user/get-my-profile")
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err?.response?.data || err.message || err))
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading, error };
}
